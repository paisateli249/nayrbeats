import fs from "fs/promises";
import path from "path";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type DownloadFormat = "mp3" | "wav";

const wavLicenses = new Set([
  "WAV Lease",
  "Unlimited",
  "Exclusive",
]);

function createDownloadName(
  title: string,
  format: DownloadFormat
) {
  const safeTitle = title
    .replace(/[^a-zA-Z0-9 _()-]/g, "")
    .trim();

  return `${safeTitle || "NAYRBEATS"}.${format}`;
}

function getContentType(format: DownloadFormat) {
  if (format === "wav") {
    return "audio/wav";
  }

  return "audio/mpeg";
}

function getRequestedFormat(
  value: string | null
): DownloadFormat {
  if (value === "wav") {
    return "wav";
  }

  return "mp3";
}

function resolveFilePath(filePath: string) {
  // If the database already contains an absolute path,
  // use it directly.
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  // Remove a leading slash so path.join does not
  // treat it as an absolute filesystem path.
  const cleanPath = filePath.replace(/^\/+/, "");

  // Files stored in public can use paths such as:
  // /downloads/high-life-90-mob/file.mp3
  // or downloads/high-life-90-mob/file.mp3
  if (
    cleanPath.startsWith("downloads/") ||
    cleanPath.startsWith("audio/")
  ) {
    return path.join(
      process.cwd(),
      "public",
      cleanPath
    );
  }

  // Otherwise treat the value as relative to
  // the project directory.
  return path.join(process.cwd(), cleanPath);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const sessionId =
      url.searchParams.get("session_id");

    const slug =
      url.searchParams.get("slug");

    const requestedFormat =
      getRequestedFormat(
        url.searchParams.get("format")
      );

    if (!sessionId) {
      return Response.json(
        {
          error:
            "A Stripe checkout session is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug) {
      return Response.json(
        {
          error: "A beat slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Find the completed order.
     *
     * We include the OrderItems and their related
     * Beat so we can verify that this customer
     * actually purchased the requested beat.
     */
    const order = await prisma.order.findUnique({
      where: {
        stripeSessionId: sessionId,
      },

      include: {
        items: {
          include: {
            beat: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json(
        {
          error:
            "This order could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    if (order.paymentStatus !== "paid") {
      return Response.json(
        {
          error:
            "This order has not been paid.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Find the purchased beat inside this order.
     */
    const purchasedItem = order.items.find(
      (item) => item.beatSlug === slug
    );

    if (!purchasedItem) {
      return Response.json(
        {
          error:
            "This beat was not found in the order.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * We normally use the Beat relation.
     *
     * If the beat was deleted from the database,
     * beatId may be null because our Prisma
     * relation uses onDelete: SetNull.
     */
    let beat = purchasedItem.beat;

    if (!beat) {
      beat = await prisma.beat.findUnique({
        where: {
          slug,
        },
      });
    }

    if (!beat) {
      return Response.json(
        {
          error:
            "The beat file could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Decide which format the customer is
     * actually allowed to download.
     *
     * MP3 Lease = MP3 only
     * WAV Lease = MP3 + WAV
     * Unlimited = MP3 + WAV
     * Exclusive = MP3 + WAV
     */
    let format: DownloadFormat =
      requestedFormat;

    if (
      format === "wav" &&
      !wavLicenses.has(purchasedItem.license)
    ) {
      return Response.json(
        {
          error:
            "Your license does not include a WAV download.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Choose the correct stored file.
     */
    let storedFilePath: string | null = null;

    if (format === "wav") {
      storedFilePath = beat.fullWavPath;
    } else {
      storedFilePath = beat.fullMp3Path;
    }

    if (!storedFilePath) {
      return Response.json(
        {
          error:
            format === "wav"
              ? "The WAV file is not available for this beat."
              : "The MP3 file is not available for this beat.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Convert the database path into the actual
     * filesystem location on your Mac/server.
     */
    const absoluteFilePath =
      resolveFilePath(storedFilePath);

    /*
     * Make sure the file actually exists before
     * attempting to send it.
     */
    try {
      await fs.access(absoluteFilePath);
    } catch {
      console.error(
        "Download file does not exist:",
        absoluteFilePath
      );

      return Response.json(
        {
          error:
            "The purchased audio file could not be found on the server.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Read the audio file.
     */
    const fileBuffer = await fs.readFile(
      absoluteFilePath
    );

    /*
     * Convert Node's Buffer to Uint8Array.
     *
     * This avoids the TypeScript Response-body
     * error you were seeing.
     */
    const fileBytes = new Uint8Array(
      fileBuffer
    );

    const fileName = createDownloadName(
      beat.title,
      format
    );

    /*
     * Send the purchased file to the browser.
     */
    return new Response(fileBytes, {
      status: 200,

      headers: {
        "Content-Type":
          getContentType(format),

        "Content-Length": String(
          fileBytes.byteLength
        ),

        "Content-Disposition":
          `attachment; filename="${fileName}"`,

        "Cache-Control":
          "private, no-store, max-age=0",

        "X-Content-Type-Options":
          "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Secure download error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to prepare this download.",
      },
      {
        status: 500,
      }
    );
  }
}