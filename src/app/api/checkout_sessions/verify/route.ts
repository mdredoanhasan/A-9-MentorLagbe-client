import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  CheckoutFulfillmentError,
  fulfillStripeCheckout,
} from "@/lib/fulfill-stripe-checkout";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to verify your payment." }, { status: 401 });
  }

  let checkoutSessionId: unknown;
  try {
    ({ sessionId: checkoutSessionId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Checkout session is missing." }, { status: 400 });
  }

  if (
    typeof checkoutSessionId !== "string" ||
    !/^cs_(test|live)_[\w]+$/.test(checkoutSessionId)
  ) {
    return NextResponse.json({ error: "Checkout session is invalid." }, { status: 400 });
  }

  try {
    const result = await fulfillStripeCheckout(checkoutSessionId, {
      id: session.user.id,
      role: session.user.role,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof CheckoutFulfillmentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Could not verify completed Stripe Checkout.");
    return NextResponse.json(
      { error: "Could not verify your payment. Please contact support if you were charged." },
      { status: 500 },
    );
  }
}
