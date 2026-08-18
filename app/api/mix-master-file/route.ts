import { get } from "@vercel/blob";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: Request
) {
  try {
    const url =
      new URL(request.url);

    const fileIdValue =
      url.searchParams.get(
        "fileId"
      );

    if (!fileIdValue) {
      return Response.json(
        {
          error:
            "File ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const fileId =
      Number(fileIdValue);

    if (
      !Number.isInteger(
        fileId
      ) ||
      fileId <= 0
    ) {
      return Response.json(
        {
          error:
            "Invalid file ID.",
        },
        {
          status: 400,
        }
      );
    }

    const file =
      await prisma.mixMasterFile.findUnique({
        where: {
          id: fileId,
        },
        include: {
          order: true,
        },
      });

    if (!file) {
      return Response.json(
        {
          error:
            "File not found.",
        },
        {
          status: 404,
        }
      );
    }

    const result =
      await get(
        file.pathname,
        {
          access: "private",
        }
      );

    if (
      !result ||
      result.statusCode !==
        200
    ) {
      return Response.json(
        {
          error:
            "Stored file could not be retrieved.",
        },
        {
          status: 404,
        }
      );
    }

    const contentType =
      result.blob.contentType ||
      "application/octet-stream";

    const safeFileName =
      file.fileName.replace(
        /["\r\n]/g,
        ""
      );

    return new Response(
      result.stream,
      {
        status: 200,

        headers: {
          "Content-Type":
            contentType,

          "Content-Disposition":
            `attachment; filename="${safeFileName}"`,

          "Cache-Control":
            "private, no-store, max-age=0",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "Mix & Master file download error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to download file.",
      },
      {
        status: 500,
      }
    );
  }
}