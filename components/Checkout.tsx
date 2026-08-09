import { NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

interface CheckoutItem {
  beatId?: number;
  title: string;
  artist: string;
  slug: string;
  license: string;
  artworkUrl?: string | null;
}

type LicenseName =
  | "MP3 Lease"
  | "WAV Lease"
  | "Unlimited"
  | "Exclusive";

function getLicensePrice(
  license: LicenseName,
  beat: {
    mp3Price: number;
    wavPrice: number;
    unlimitedPrice: number;
    exclusivePrice: number;
  }
) {
  switch (license) {
    case "MP3 Lease":
      return beat.mp3Price;

    case "WAV Lease":
      return beat.wavPrice;

    case "Unlimited":
      return beat.unlimitedPrice;

    case "Exclusive":
      return beat.exclusivePrice;
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error:
            "Stripe secret key is missing from .env.local.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();
    const items = body.items as CheckoutItem[];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const verifiedItems = await Promise.all(
      items.map(async (item) => {
        const beat = await prisma.beat.findUnique({
          where: {
            slug: item.slug,
          },
        });

        if (!beat || !beat.published) {
          throw new Error(
            `Beat "${item.slug}" was not found or is unavailable.`
          );
        }

        const validLicenses: LicenseName[] = [
          "MP3 Lease",
          "WAV Lease",
          "Unlimited",
          "Exclusive",
        ];

        if (
          !validLicenses.includes(
            item.license as LicenseName
          )
        ) {
          throw new Error(
            `Invalid license for "${beat.title}".`
          );
        }

        const license =
          item.license as LicenseName;

        const price = getLicensePrice(
          license,
          beat
        );

        return {
          beat,
          license,
          price,
        };
      })
    );

    const origin =
      request.headers.get("origin") ??
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: verifiedItems.map(
          ({ beat, license, price }) => ({
            price_data: {
              currency: "usd",

              product_data: {
                name: beat.title,
                description: `${license} • ${beat.artist}`,

                metadata: {
                  beatId: String(beat.id),
                  slug: beat.slug,
                  license,
                },
              },

              unit_amount: Math.round(
                price * 100
              ),
            },

            quantity: 1,
          })
        ),

        metadata: {
          cart: JSON.stringify(
            verifiedItems.map(
              ({ beat, license }) => ({
                beatId: beat.id,
                slug: beat.slug,
                license,
              })
            )
          ),
        },

        customer_creation: "always",

        billing_address_collection: "required",

        allow_promotion_codes: true,

        success_url:
          `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${origin}/`,
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
      "Stripe checkout error:",
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