import Stripe from "stripe";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

type LicenseName =
  | "MP3 Lease"
  | "WAV Lease"
  | "Unlimited"
  | "Exclusive";

interface StripeCartItem {
  beatId: number;
  slug: string;
  license: LicenseName;
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
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is missing."
    );

    return Response.json(
      {
        error:
          "Stripe webhook secret is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      {
        error: "Missing Stripe signature.",
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook verification failed:",
      error
    );

    return Response.json(
      {
        error: "Invalid webhook signature.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const incomingSession =
        event.data
          .object as Stripe.Checkout.Session;

      const session =
        await stripe.checkout.sessions.retrieve(
          incomingSession.id
        );

      if (
        session.payment_status !== "paid"
      ) {
        return Response.json({
          received: true,
          message:
            "Checkout completed, but payment is not marked paid.",
        });
      }

      const cartMetadata =
        session.metadata?.cart;

      if (!cartMetadata) {
        throw new Error(
          "Stripe Checkout Session has no cart metadata."
        );
      }

      let cartItems: StripeCartItem[];

      try {
        cartItems = JSON.parse(
          cartMetadata
        ) as StripeCartItem[];
      } catch {
        throw new Error(
          "Stripe cart metadata is invalid."
        );
      }

      if (
        !Array.isArray(cartItems) ||
        cartItems.length === 0
      ) {
        throw new Error(
          "Stripe cart metadata is empty."
        );
      }

      const existingOrder =
        await prisma.order.findUnique({
          where: {
            stripeSessionId: session.id,
          },
        });

      if (existingOrder) {
        return Response.json({
          received: true,
          message:
            "Order already recorded.",
        });
      }

      const validLicenses: LicenseName[] =
        [
          "MP3 Lease",
          "WAV Lease",
          "Unlimited",
          "Exclusive",
        ];

      const verifiedItems =
        await Promise.all(
          cartItems.map(async (item) => {
            const beat =
              await prisma.beat.findUnique({
                where: {
                  id: item.beatId,
                },
              });

            if (!beat) {
              throw new Error(
                `Beat ${item.beatId} was not found.`
              );
            }

            if (
              !validLicenses.includes(
                item.license
              )
            ) {
              throw new Error(
                `Invalid license for ${beat.title}.`
              );
            }

            return {
              beat,
              license: item.license,
              price: getLicensePrice(
                item.license,
                beat
              ),
            };
          })
        );

      const paymentIntentId =
        typeof session.payment_intent ===
        "string"
          ? session.payment_intent
          : session.payment_intent?.id ??
            null;

      const customerEmail =
        session.customer_details?.email ??
        session.customer_email ??
        "unknown@example.com";

      const customerName =
        session.customer_details?.name ??
        null;

      await prisma.$transaction(
        async (transaction) => {
          await transaction.order.create({
            data: {
              stripeSessionId:
                session.id,

              stripePaymentIntentId:
                paymentIntentId,

              customerEmail,

              customerName,

              amountTotal:
                session.amount_total ?? 0,

              currency:
                session.currency ?? "usd",

              paymentStatus:
                session.payment_status,

              items: {
                create: verifiedItems.map(
                  ({
                    beat,
                    license,
                    price,
                  }) => ({
                    beatId: beat.id,

                    beatTitle:
                      beat.title,

                    beatSlug:
                      beat.slug,

                    artist:
                      beat.artist,

                    license,

                    price,
                  })
                ),
              },
            },
          });

          const exclusiveItems =
            verifiedItems.filter(
              (item) =>
                item.license ===
                "Exclusive"
            );

          for (
            const item of exclusiveItems
          ) {
            await transaction.beat.update({
              where: {
                id: item.beat.id,
              },

              data: {
                published: false,
              },
            });
          }
        }
      );

      console.log(
        `Saved Stripe order ${session.id}`
      );
    }

    return Response.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}