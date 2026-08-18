import fs from "fs/promises";
import path from "path";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type DownloadFormat = "mp3" | "wav";

type OrderItemWithBeat = {
  beatSlug: string;
  license: string;
  beat: {
    title: string;
    fullMp3Path: string | null;
    fullWavPath: string | null;
  } | null;
};

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
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  const cleanPath =
    filePath.replace(/^\/+/, "");

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

  return path.join(
    process.cwd(),
    cleanPath
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const token =
      url.searchParams.get("token");

    const slug =
      url.searchParams.get("slug");

    const requestedFormat =
      getRequestedFormat(
        url.searchParams.get("format")
      );

    if (!token) {
      return Response.json(
        {
          error:
            "A secure download token is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug) {
      return Response.json(
        {
          error:
            "A beat slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Find the paid order using the private
     * download token instead of Stripe session ID.
     */
    const order =
      await prisma.order.findUnique({
        where: {
          downloadToken: token,
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
            "This download link is invalid.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      order.paymentStatus !== "paid"
    ) {
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
     * Block expired download links.
     */
    if (
      !order.downloadExpiresAt
    ) {
      return Response.json(
        {
          error:
            "This download link has no expiration date.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      order.downloadExpiresAt.getTime() <
      Date.now()
    ) {
      return Response.json(
        {
          error:
            "This download link has expired.",
        },
        {
          status: 403,
        }
      );
    }

    const orderItems =
      order.items as OrderItemWithBeat[];

    const purchasedItem =
      orderItems.find(
        (item) =>
          item.beatSlug === slug
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

    let beat =
      purchasedItem.beat;

    if (!beat) {
      beat =
        await prisma.beat.findUnique({
          where: {
            slug,
          },

          select: {
            title: true,
            fullMp3Path: true,
            fullWavPath: true,
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

    const format: DownloadFormat =
      requestedFormat;

    if (
      format === "wav" &&
      !wavLicenses.has(
        purchasedItem.license
      )
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

    let storedFilePath:
      | string
      | null = null;

    if (format === "wav") {
      storedFilePath =
        beat.fullWavPath;
    } else {
      storedFilePath =
        beat.fullMp3Path;
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

    const absoluteFilePath =
      resolveFilePath(
        storedFilePath
      );

    try {
      await fs.access(
        absoluteFilePath
      );
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

    const fileBuffer =
      await fs.readFile(
        absoluteFilePath
      );

    const fileBytes =
      new Uint8Array(
        fileBuffer
      );

    const fileName =
      createDownloadName(
        beat.title,
        format
      );

    return new Response(
      fileBytes,
      {
        status: 200,

        headers: {
          "Content-Type":
            getContentType(
              format
            ),

          "Content-Length":
            String(
              fileBytes.byteLength
            ),

          "Content-Disposition":
            `attachment; filename="${fileName}"`,

          "Cache-Control":
            "private, no-store, max-age=0",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
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