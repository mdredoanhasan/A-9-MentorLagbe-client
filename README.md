This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Stripe Pro checkout

The Pro Tutor and Pro Student plans use separate one-time Stripe Checkout prices.
The checkout route selects the matching price from the signed-in user's role; a
payment is verified with Stripe before the user's `plan` is changed to `pro`.
Successful payments are also saved to MongoDB's `payments` collection.

Copy the Stripe values from `.env.example` into `.env`. Set `STRIPE_SECRET_KEY`
and configure `STRIPE_WEBHOOK_SECRET` from Stripe. To test webhooks locally, run
`stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the
signing secret printed by Stripe CLI. Subscribe the webhook to
`checkout.session.completed` and `checkout.session.async_payment_succeeded`.
The existing Pro price IDs are used by default; set `STRIPE_TUTOR_PRO_PRICE_ID`
and `STRIPE_STUDENT_PRO_PRICE_ID` to override them. The old
`STRIPE_MENTOR_PRO_PRICE_ID` name remains supported for compatibility.

The success page also verifies the Checkout Session, so Pro is activated when
the customer returns. The webhook covers payments where they do not return.
Stripe-hosted Checkout does not need the publishable key in the browser.

The app now uses `tutor` as the account role and route name. Existing accounts
and records that still use `mentor` remain supported; old mentor dashboard URLs
redirect to the tutor dashboard.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
