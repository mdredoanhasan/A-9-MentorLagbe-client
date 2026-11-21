import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';



export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Pro mentor plan
          price: 'price_1Ue5pBJuiVoHX8wwKr048q8k',
          quantity: 1,
            },
           {
         //Pro student plan
          price: 'price_1Ue5qRJuiVoHX8wwM7SZmozg',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'Mentor_Lagbe_web_001',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}