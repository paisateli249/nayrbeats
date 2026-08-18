import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Stripe is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY
    );

    const body = await request.json();

    const {
      name,
      email,
      songTitle,
      notes,
    } = body;

    if (
      !name ||
      !email ||
      !songTitle
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, and song title are required.",
        },
        {
          status: 400,
        }
      );
    }

    const origin =
      request.headers.get("origin") ??
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        customer_email: email,

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name:
                  "NAYRBEATS Mix & Master",

                description:
                  `Mix & Master for "${songTitle}"`,
              },

              unit_amount: 5000,
            },

            quantity: 1,
          },
        ],

        metadata: {
          service: "mix-master",
          customerName: name,
          customerEmail: email,
          songTitle,
          notes: notes ?? "",
        },

        payment_intent_data: {
          metadata: {
            service: "mix-master",
            customerName: name,
            customerEmail: email,
            songTitle,
          },
        },

        billing_address_collection:
          "required",

        success_url:
          `${origin}/mix-master/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/mix-master`,
      });

    if (!session.url) {
      throw new Error(
        "Stripe did not return a checkout URL."
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Mix & Master checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}