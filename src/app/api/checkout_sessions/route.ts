import { auth, database } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProPlan, normalizePlanRole } from "@/lib/stripe-plans";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in before choosing a Pro plan." }, { status: 401 });
  }

  let planId: unknown;
  try {
    ({ planId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Choose a valid Pro plan." }, { status: 400 });
  }

  if (typeof planId !== "string") {
    return NextResponse.json({ error: "Choose a valid Pro plan." }, { status: 400 });
  }
  const plan = getProPlan(planId);
  const userRole = normalizePlanRole(session.user.role);
  if (!plan) {
    return NextResponse.json({ error: "Choose a valid Pro plan." }, { status: 400 });
  }
  if (!userRole || plan.role !== userRole) {
    return NextResponse.json(
      { error: "This Pro plan is only available to the matching account type." },
      { status: 403 },
    );
  }

  try {
    if (!/^[\da-f]{24}$/i.test(session.user.id)) {
      return NextResponse.json({ error: "Your account could not be verified." }, { status: 409 });
    }
    const user = await database
      .collection("user")
      .findOne({ _id: new ObjectId(session.user.id) }, { projection: { plan: 1 } });
    if (!user) {
      return NextResponse.json({ error: "Your account could not be verified." }, { status: 404 });
    }
    if (user.plan === "pro") {
      return NextResponse.json({ error: "Your account already has Pro." }, { status: 409 });
    }

    const appOrigin =
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.BETTER_AUTH_URL ??
      new URL(request.url).origin;
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      client_reference_id: session.user.id,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        role: userRole,
        planId: plan.id,
      },
      success_url: `${appOrigin.replace(/\/$/, "")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appOrigin.replace(/\/$/, "")}/cancel?plan=${plan.id}`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    console.error("Could not create Stripe Checkout session.");
    return NextResponse.json(
      { error: "Could not start checkout. Please try again later." },
      { status: 500 },
    );
  }
}
