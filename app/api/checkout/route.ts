import { NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

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

function isLicenseName(
  value: string
): value is LicenseName {
  return [
    "MP3 Lease",
    "WAV Lease",
    "Unlimited",
    "Exclusive",
  ].includes(value);
}

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
    const stripeSecretKey =
      process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error:
            "STRIPE_SECRET_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Create Stripe only when the checkout
     * route actually receives a request.
     *
     * This prevents Vercel from trying to
     * initialize Stripe during the build.
     */
    const stripe = new Stripe(
      stripeSecretKey
    );

    const body = await request.json();

    const items =
      body.items as CheckoutItem[];

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const verifiedItems =
      await Promise.all(
        items.map(
          async (item: CheckoutItem) => {
            if (!item.slug) {
              throw new Error(
                "A cart item is missing its beat slug."
              );
            }

            const beat =
              await prisma.beat.findUnique({
                where: {
                  slug: item.slug,
                },
              });

            if (
              !beat ||
              !beat.published
            ) {
              throw new Error(
                `Beat "${item.slug}" was not found or is unavailable.`
              );
            }

            if (
              !isLicenseName(
                item.license
              )
            ) {
              throw new Error(
                `Invalid license for "${beat.title}".`
              );
            }

            const price =
              getLicensePrice(
                item.license,
                beat
              );

            return {
              beat,
              license:
                item.license,
              price,
            };
          }
        )
      );

    const origin =
      request.headers.get("origin") ??
      "http://localhost:3000";

    const cartMetadata =
      verifiedItems.map(
        ({ beat, license }) => ({
          beatId: beat.id,
          slug: beat.slug,
          license,
        })
      );

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: [
          "card",
        ],

        line_items:
          verifiedItems.map(
            ({
              beat,
              license,
              price,
            }) => ({
              price_data: {
                currency: "usd",

                product_data: {
                  name: beat.title,

                  description:
                    `${license} • ${beat.artist}`,

                  metadata: {
                    beatId:
                      String(
                        beat.id
                      ),

                    slug:
                      beat.slug,

                    license,
                  },
                },

                unit_amount:
                  Math.round(
                    price * 100
                  ),
              },

              quantity: 1,
            })
          ),

        metadata: {
          cart: JSON.stringify(
            cartMetadata
          ),
        },

        payment_intent_data: {
          metadata: {
            cart: JSON.stringify(
              cartMetadata
            ),
          },
        },

        customer_creation:
          "always",

        billing_address_collection:
          "required",

        allow_promotion_codes:
          true,

        success_url:
          `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/`,
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