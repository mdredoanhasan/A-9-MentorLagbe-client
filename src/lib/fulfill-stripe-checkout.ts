import "server-only";

import { ObjectId } from "mongodb";
import { database } from "@/app/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getProPlan, normalizePlanRole } from "@/lib/stripe-plans";

export class CheckoutFulfillmentError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

type ExpectedCustomer = {
  id: string;
  role: string;
};

export async function fulfillStripeCheckout(
  checkoutSessionId: string,
  expectedCustomer?: ExpectedCustomer,
) {
  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (checkoutSession.mode !== "payment" || checkoutSession.payment_status !== "paid") {
    throw new CheckoutFulfillmentError("This checkout has not been paid yet.", 409);
  }

  const customerId = checkoutSession.metadata?.userId;
  const planId = checkoutSession.metadata?.planId;
  const role = normalizePlanRole(checkoutSession.metadata?.role);
  const plan = planId ? getProPlan(planId) : null;

  if (!customerId || !/^[\da-f]{24}$/i.test(customerId) || !role || !plan || plan.role !== role) {
    throw new CheckoutFulfillmentError("Checkout details could not be verified.", 400);
  }
  if (expectedCustomer) {
    const expectedRole = normalizePlanRole(expectedCustomer.role);
    if (customerId !== expectedCustomer.id || role !== expectedRole) {
      throw new CheckoutFulfillmentError("This checkout belongs to another account.", 403);
    }
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id, {
    limit: 2,
  });
  if (
    lineItems.data.length !== 1 ||
    lineItems.data[0].quantity !== 1 ||
    (typeof lineItems.data[0].price === "string"
      ? lineItems.data[0].price
      : lineItems.data[0].price?.id) !== plan.priceId
  ) {
    throw new CheckoutFulfillmentError("The purchased plan does not match this account.", 400);
  }

  const userId = new ObjectId(customerId);
  const usersCollection = database.collection("user");
  const user = await usersCollection.findOne({ _id: userId });
  if (!user || normalizePlanRole(user.role) !== role) {
    throw new CheckoutFulfillmentError("The account no longer matches this plan.", 409);
  }

  const updatedUser = await usersCollection.updateOne(
    { _id: userId, role: user.role },
    { $set: { plan: "pro", planUpdatedAt: new Date() } },
  );
  if (!updatedUser.matchedCount) {
    throw new CheckoutFulfillmentError("The account could not be updated.", 409);
  }

  const paymentIntentId =
    typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id;
  const payment = {
    stripeSessionId: checkoutSession.id,
    stripePaymentIntentId: paymentIntentId ?? null,
    userId: customerId,
    userName: user.name,
    email: user.email,
    role,
    plan: plan.id,
    amount: (checkoutSession.amount_total ?? 0) / 100,
    currency: checkoutSession.currency,
    transactionId: paymentIntentId ?? checkoutSession.id,
    paidAt: new Date(checkoutSession.created * 1000),
  };
  const paymentsCollection = database.collection("payments");
  await paymentsCollection.createIndex(
    { stripeSessionId: 1 },
    {
      unique: true,
      partialFilterExpression: { stripeSessionId: { $type: "string" } },
    },
  );
  await paymentsCollection.updateOne(
    { stripeSessionId: checkoutSession.id },
    { $setOnInsert: payment },
    { upsert: true },
  );

  return { plan: plan.id, role };
}
