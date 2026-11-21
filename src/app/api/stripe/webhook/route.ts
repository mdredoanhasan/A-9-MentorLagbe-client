import { getStripe } from "@/lib/stripe";
import {
  CheckoutFulfillmentError,
  fulfillStripeCheckout,
} from "@/lib/fulfill-stripe-checkout";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Stripe signature is required." }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.async_payment_succeeded" ||
    (event.type === "checkout.session.completed" &&
      event.data.object.payment_status === "paid")
  ) {
    try {
      await fulfillStripeCheckout(event.data.object.id);
    } catch (error) {
      if (error instanceof CheckoutFulfillmentError) {
        console.error("Stripe Checkout could not be fulfilled:", error.message);
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      console.error("Stripe Checkout fulfillment failed; Stripe can retry this event.");
      return NextResponse.json({ error: "Checkout fulfillment failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
