import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const allowedContentTypes = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/aiff",
  "audio/x-aiff",
  "application/zip",
  "application/x-zip-compressed",
];

interface ClientPayload {
  orderId: number;
  customerEmail: string;
}

interface StoredTokenPayload {
  orderId: number;
  customerEmail: string;
  originalPathname: string;
}

interface CompleteUploadBody {
  orderId: number;
  customerEmail: string;
  pathname: string;
  blobUrl: string;
  fileName: string;
}

/*
 * =====================================
 * VERIFY PAID MIX & MASTER ORDER
 * =====================================
 */
async function verifyOrder(
  orderId: number,
  customerEmail: string
) {
  const order =
    await prisma.mixMasterOrder.findUnique({
      where: {
        id: orderId,
      },
    });

  if (!order) {
    throw new Error(
      "Mix & Master order was not found."
    );
  }

  if (
    order.paymentStatus !==
    "paid"
  ) {
    throw new Error(
      "This Mix & Master order has not been paid."
    );
  }

  if (
    order.customerEmail
      .trim()
      .toLowerCase() !==
    customerEmail
      .trim()
      .toLowerCase()
  ) {
    throw new Error(
      "The email does not match this order."
    );
  }

  return order;
}

/*
 * =====================================
 * POST
 * =====================================
 */
export async function POST(
  request: Request
) {
  try {
    const url =
      new URL(request.url);

    /*
     * =====================================
     * SAVE COMPLETED UPLOAD
     *
     * This is used by localhost because
     * Vercel cannot call localhost after
     * the Blob upload finishes.
     * =====================================
     */
    if (
      url.searchParams.get(
        "action"
      ) === "complete"
    ) {
      const body =
        (await request.json()) as CompleteUploadBody;

      const {
        orderId,
        customerEmail,
        pathname,
        blobUrl,
        fileName,
      } = body;

      if (
        !orderId ||
        !customerEmail ||
        !pathname ||
        !blobUrl ||
        !fileName
      ) {
        return Response.json(
          {
            error:
              "Missing completed upload information.",
          },
          {
            status: 400,
          }
        );
      }

      await verifyOrder(
        orderId,
        customerEmail
      );

      const savedFile =
        await prisma.mixMasterFile.upsert({
          where: {
            pathname,
          },

          update: {
            blobUrl,
            fileName,
            orderId,
          },

          create: {
            orderId,
            pathname,
            blobUrl,
            fileName,
          },
        });

      console.log(
        `Saved Mix & Master file ${pathname} for order ${orderId}`
      );

      return Response.json({
        success: true,
        file: {
          id:
            savedFile.id,
          fileName:
            savedFile.fileName,
          orderId:
            savedFile.orderId,
        },
      });
    }

    /*
     * =====================================
     * VERCEL BLOB TOKEN / CALLBACK
     * =====================================
     */
    const body =
      (await request.json()) as HandleUploadBody;

    const jsonResponse =
      await handleUpload({
        body,
        request,

        onBeforeGenerateToken:
          async (
            pathname,
            clientPayload
          ) => {
            if (!clientPayload) {
              throw new Error(
                "Missing upload information."
              );
            }

            let payload:
              ClientPayload;

            try {
              payload =
                JSON.parse(
                  clientPayload
                ) as ClientPayload;
            } catch {
              throw new Error(
                "Invalid upload information."
              );
            }

            const {
              orderId,
              customerEmail,
            } = payload;

            if (
              !orderId ||
              !customerEmail
            ) {
              throw new Error(
                "Order ID and customer email are required."
              );
            }

            const order =
              await verifyOrder(
                orderId,
                customerEmail
              );

            const safePathname =
              pathname.replace(
                /[^a-zA-Z0-9._/-]/g,
                "-"
              );

            return {
              allowedContentTypes,

              access:
                "private",

              addRandomSuffix:
                true,

              tokenPayload:
                JSON.stringify({
                  orderId:
                    order.id,

                  customerEmail:
                    order.customerEmail,

                  originalPathname:
                    safePathname,
                }),
            };
          },

        /*
         * This will work automatically
         * once NAYRBEATS is deployed
         * on Vercel.
         */
        onUploadCompleted:
          async ({
            blob,
            tokenPayload,
          }) => {
            if (!tokenPayload) {
              console.error(
                "Upload completed without token payload."
              );

              return;
            }

            let payload:
              StoredTokenPayload;

            try {
              payload =
                JSON.parse(
                  tokenPayload
                ) as StoredTokenPayload;
            } catch {
              console.error(
                "Unable to parse upload token payload."
              );

              return;
            }

            const {
              orderId,
              customerEmail,
              originalPathname,
            } = payload;

            await verifyOrder(
              orderId,
              customerEmail
            );

            const pathParts =
              originalPathname.split(
                "/"
              );

            const fileName =
              pathParts[
                pathParts.length - 1
              ] ||
              originalPathname;

            await prisma.mixMasterFile.upsert({
              where: {
                pathname:
                  blob.pathname,
              },

              update: {
                blobUrl:
                  blob.url,

                fileName,

                orderId,
              },

              create: {
                orderId,

                pathname:
                  blob.pathname,

                blobUrl:
                  blob.url,

                fileName,
              },
            });

            console.log(
              `Saved Mix & Master file ${blob.pathname} for order ${orderId}`
            );
          },
      });

    return Response.json(
      jsonResponse
    );
  } catch (error) {
    console.error(
      "Mix & Master upload error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process file upload.",
      },
      {
        status: 400,
      }
    );
  }
}