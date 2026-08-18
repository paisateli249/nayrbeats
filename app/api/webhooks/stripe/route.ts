import crypto from "crypto";
import Stripe from "stripe";
import { Resend } from "resend";

import prisma from "@/lib/prisma";
import { EmailTemplate } from "@/components/email-template";
import { MixMasterEmailTemplate } from "@/components/mix-master-email-template";

export const runtime = "nodejs";

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

type TransactionDb = Pick<
  typeof prisma,
  "order" | "beat"
>;

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

function getPaymentIntentId(
  session: Stripe.Checkout.Session
) {
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? null;
}

function createDownloadToken() {
  return crypto.randomUUID();
}

function createDownloadExpiration() {
  return new Date(
    Date.now() +
      7 * 24 * 60 * 60 * 1000
  );
}

function formatMoney(
  amountInDollars: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: currency.toUpperCase(),
    }
  ).format(amountInDollars);
}

function formatExpiration(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  ).format(date);
}

export async function POST(
  request: Request
) {
  const stripeSecretKey =
    process.env.STRIPE_SECRET_KEY;

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  const resendApiKey =
    process.env.RESEND_API_KEY;

  if (!stripeSecretKey) {
    console.error(
      "STRIPE_SECRET_KEY is missing."
    );

    return Response.json(
      {
        error:
          "Stripe secret key is not configured.",
      },
      {
        status: 500,
      }
    );
  }

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

  const stripe =
    new Stripe(stripeSecretKey);

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return Response.json(
      {
        error:
          "Missing Stripe signature.",
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody =
      await request.text();

    event =
      stripe.webhooks.constructEvent(
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
        error:
          "Invalid webhook signature.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    if (
      event.type !==
      "checkout.session.completed"
    ) {
      return Response.json({
        received: true,
      });
    }

    const incomingSession =
      event.data
        .object as Stripe.Checkout.Session;

    const session =
      await stripe.checkout.sessions.retrieve(
        incomingSession.id
      );

    if (
      session.payment_status !==
      "paid"
    ) {
      return Response.json({
        received: true,
        message:
          "Checkout completed, but payment is not marked paid.",
      });
    }

    const service =
      session.metadata?.service;

    /*
     * =====================================
     * MIX & MASTER ORDER
     * =====================================
     */
    if (service === "mix-master") {
      const customerName =
        session.metadata
          ?.customerName ??
        session.customer_details
          ?.name ??
        "";

      const customerEmail =
        session.metadata
          ?.customerEmail ??
        session.customer_details
          ?.email ??
        session.customer_email ??
        "";

      const songTitle =
        session.metadata
          ?.songTitle ??
        "";

      const notes =
        session.metadata
          ?.notes ??
        null;

      if (!customerName) {
        throw new Error(
          "Mix & Master checkout is missing customer name."
        );
      }

      if (!customerEmail) {
        throw new Error(
          "Mix & Master checkout is missing customer email."
        );
      }

      if (!songTitle) {
        throw new Error(
          "Mix & Master checkout is missing song title."
        );
      }

      const existingMixOrder =
        await prisma.mixMasterOrder.findUnique({
          where: {
            stripeSessionId:
              session.id,
          },
        });

      if (existingMixOrder) {
        return Response.json({
          received: true,
          message:
            "Mix & Master order already recorded.",
        });
      }

      const paymentIntentId =
        getPaymentIntentId(session);

      await prisma.mixMasterOrder.create({
        data: {
          stripeSessionId:
            session.id,

          stripePaymentIntentId:
            paymentIntentId,

          customerName,

          customerEmail,

          songTitle,

          notes,

          amountTotal:
            session.amount_total ??
            5000,

          currency:
            session.currency ??
            "usd",

          paymentStatus:
            session.payment_status,

          projectStatus:
            "new",
        },
      });

      console.log(
        `Saved Mix & Master order ${session.id}`
      );

      /*
       * =====================================
       * SEND MIX & MASTER EMAILS
       * =====================================
       */
      if (resendApiKey) {
        try {
          const resend =
            new Resend(
              resendApiKey
            );

          const amountPaid =
            formatMoney(
              (
                session.amount_total ??
                5000
              ) / 100,
              session.currency ??
                "usd"
            );

          /*
           * Customer confirmation email.
           */
          const {
            error:
              mixEmailError,
          } =
            await resend.emails.send(
              {
                from:
                  "NAYRBEATS <orders@nayrbeats.com>",

                to: [
                  customerEmail,
                ],

                subject:
                  `Your NAYRBEATS Mix & Master Booking — ${songTitle}`,

                react:
                  MixMasterEmailTemplate({
                    customerName,
                    songTitle,
                    amountPaid,
                  }),
              },
              {
                idempotencyKey:
                  `mix-master-customer/${session.id}`,
              }
            );

          if (mixEmailError) {
            console.error(
              "Mix & Master customer email error:",
              mixEmailError
            );
          } else {
            console.log(
              `Mix & Master customer email sent to ${customerEmail}`
            );
          }

          /*
           * Private owner notification.
           */
          const {
            error:
              ownerEmailError,
          } =
            await resend.emails.send(
              {
                from:
                  "NAYRBEATS <orders@nayrbeats.com>",

                to: [
                  "nayrbeats@gmail.com",
                ],

                subject:
                  `NEW MIX & MASTER ORDER — ${songTitle}`,

                html: `
                  <div style="font-family:Arial,sans-serif;background:#090909;color:#ffffff;padding:30px;">
                    <h2 style="color:#2563eb;">
                      NEW MIX & MASTER ORDER
                    </h2>

                    <p>
                      <strong>Customer:</strong>
                      ${customerName}
                    </p>

                    <p>
                      <strong>Email:</strong>
                      ${customerEmail}
                    </p>

                    <p>
                      <strong>Song:</strong>
                      ${songTitle}
                    </p>

                    <p>
                      <strong>Amount:</strong>
                      ${amountPaid}
                    </p>

                    <p>
                      <strong>Notes:</strong>
                    </p>

                    <p>
                      ${notes || "No notes provided."}
                    </p>

                    <p style="margin-top:24px;color:#777777;">
                      Stripe Session:
                      ${session.id}
                    </p>
                  </div>
                `,
              },
              {
                idempotencyKey:
                  `mix-master-owner/${session.id}`,
              }
            );

          if (ownerEmailError) {
            console.error(
              "Owner Mix & Master email error:",
              ownerEmailError
            );
          } else {
            console.log(
              "Owner Mix & Master notification sent."
            );
          }
        } catch (emailError) {
          console.error(
            "Unable to send Mix & Master emails:",
            emailError
          );
        }
      } else {
        console.warn(
          "RESEND_API_KEY is missing. Mix & Master emails were not sent."
        );
      }

      return Response.json({
        received: true,
        message:
          "Mix & Master order recorded.",
      });
    }

    /*
     * =====================================
     * BEAT PURCHASE ORDER
     * =====================================
     */

    const cartMetadata =
      session.metadata?.cart;

    if (!cartMetadata) {
      throw new Error(
        "Stripe Checkout Session has no cart metadata."
      );
    }

    let cartItems: StripeCartItem[];

    try {
      cartItems =
        JSON.parse(
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
          stripeSessionId:
            session.id,
        },
      });

    if (existingOrder) {
      if (
        !existingOrder.downloadToken ||
        !existingOrder.downloadExpiresAt
      ) {
        const repairedDownloadToken =
          createDownloadToken();

        const repairedDownloadExpiresAt =
          createDownloadExpiration();

        await prisma.order.update({
          where: {
            id:
              existingOrder.id,
          },

          data: {
            downloadToken:
              existingOrder.downloadToken ??
              repairedDownloadToken,

            downloadExpiresAt:
              existingOrder.downloadExpiresAt ??
              repairedDownloadExpiresAt,
          },
        });

        console.log(
          `Repaired download access for order ${existingOrder.id}`
        );
      }

      return Response.json({
        received: true,
        message:
          "Order already recorded.",
      });
    }

    const validLicenses:
      LicenseName[] = [
      "MP3 Lease",
      "WAV Lease",
      "Unlimited",
      "Exclusive",
    ];

    const verifiedItems =
      await Promise.all(
        cartItems.map(
          async (
            item: StripeCartItem
          ) => {
            const beat =
              await prisma.beat.findUnique({
                where: {
                  id:
                    item.beatId,
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

              license:
                item.license,

              price:
                getLicensePrice(
                  item.license,
                  beat
                ),
            };
          }
        )
      );

    const paymentIntentId =
      getPaymentIntentId(session);

    const customerEmail =
      session.customer_details
        ?.email ??
      session.customer_email ??
      "";

    const customerName =
      session.customer_details
        ?.name ??
      "";

    if (!customerEmail) {
      throw new Error(
        "Beat checkout is missing customer email."
      );
    }

    const downloadToken =
      createDownloadToken();

    const downloadExpiresAt =
      createDownloadExpiration();

    const createdOrder =
      await prisma.$transaction(
        async (
          transaction: TransactionDb
        ) => {
          const order =
            await transaction.order.create({
              data: {
                stripeSessionId:
                  session.id,

                stripePaymentIntentId:
                  paymentIntentId,

                customerEmail,

                customerName:
                  customerName ||
                  null,

                amountTotal:
                  session.amount_total ??
                  0,

                currency:
                  session.currency ??
                  "usd",

                paymentStatus:
                  session.payment_status,

                downloadToken,

                downloadExpiresAt,

                items: {
                  create:
                    verifiedItems.map(
                      ({
                        beat,
                        license,
                        price,
                      }) => ({
                        beatId:
                          beat.id,

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

              include: {
                items: true,
              },
            });

          const exclusiveItems =
            verifiedItems.filter(
              (item) =>
                item.license ===
                "Exclusive"
            );

          for (
            const item
            of exclusiveItems
          ) {
            await transaction.beat.update({
              where: {
                id:
                  item.beat.id,
              },

              data: {
                published:
                  false,
              },
            });
          }

          return order;
        }
      );

    console.log(
      `Saved Stripe beat order ${session.id}`
    );

    /*
     * =====================================
     * SEND BEAT PURCHASE EMAIL
     * =====================================
     */
    if (resendApiKey) {
      try {
        const resend =
          new Resend(
            resendApiKey
          );

        const siteUrl =
          process.env
            .NEXT_PUBLIC_SITE_URL ??
          "https://nayrbeats.com";

        for (
          const item
          of createdOrder.items
        ) {
          const downloadUrl =
            `${siteUrl}/api/download` +
            `?token=${encodeURIComponent(
              downloadToken
            )}` +
            `&slug=${encodeURIComponent(
              item.beatSlug
            )}` +
            `&format=mp3`;

          const licenseUrl =
            `${siteUrl}/api/license` +
            `?token=${encodeURIComponent(
              downloadToken
            )}` +
            `&slug=${encodeURIComponent(
              item.beatSlug
            )}`;

          const {
            error:
              emailError,
          } =
            await resend.emails.send(
              {
                from:
                  "NAYRBEATS <orders@nayrbeats.com>",

                to: [
                  customerEmail,
                ],

                subject:
                  `Your NAYRBEATS Purchase — ${item.beatTitle}`,

                react:
                  EmailTemplate({
                    customerName,

                    beatTitle:
                      item.beatTitle,

                    license:
                      item.license,

                    amountPaid:
                      formatMoney(
                        item.price,
                        createdOrder.currency
                      ),

                    downloadUrl,

                    licenseUrl,

                    downloadExpiresAt:
                      formatExpiration(
                        downloadExpiresAt
                      ),
                  }),
              },
              {
                idempotencyKey:
                  `beat-purchase/${session.id}/${item.id}`,
              }
            );

          if (emailError) {
            console.error(
              "Resend purchase email error:",
              emailError
            );
          } else {
            console.log(
              `Purchase email sent to ${customerEmail} for ${item.beatTitle}`
            );
          }
        }
      } catch (emailError) {
        console.error(
          "Unable to send purchase email:",
          emailError
        );
      }
    } else {
      console.warn(
        "RESEND_API_KEY is missing. Purchase email was not sent."
      );
    }

    return Response.json({
      received: true,
      message:
        "Beat order recorded.",
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