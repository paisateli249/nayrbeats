import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type LicenseName =
  | "MP3 Lease"
  | "WAV Lease"
  | "Unlimited"
  | "Exclusive";

function formatMoney(
  amountInDollars: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency:
        currency.toUpperCase(),
    }
  ).format(amountInDollars);
}

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "long",
    }
  ).format(date);
}

function getLicenseTerms(
  license: LicenseName
) {
  switch (license) {
    case "MP3 Lease":
      return [
        "Non-exclusive license.",
        "Includes one untagged MP3 file.",
        "Use for one music video.",
        "Up to 50,000 audio streams.",
        "Producer retains ownership of the beat.",
        "License may not be transferred or resold.",
      ];

    case "WAV Lease":
      return [
        "Non-exclusive license.",
        "Includes untagged MP3 and WAV files.",
        "Use for one music video.",
        "Up to 150,000 audio streams.",
        "Producer retains ownership of the beat.",
        "License may not be transferred or resold.",
      ];

    case "Unlimited":
      return [
        "Non-exclusive license.",
        "Includes MP3, WAV, and available stems.",
        "Unlimited audio streams.",
        "Unlimited music videos.",
        "Producer retains ownership of the beat.",
        "License may not be transferred or resold.",
      ];

    case "Exclusive":
      return [
        "Exclusive license.",
        "Includes MP3, WAV, and available stems.",
        "Unlimited audio streams.",
        "Unlimited music videos.",
        "Beat is removed from public sale after purchase.",
        "Buyer receives exclusive usage rights subject to this agreement.",
      ];
  }
}

function safeFileName(
  value: string
) {
  return value
    .replace(
      /[^a-zA-Z0-9 _()-]/g,
      ""
    )
    .trim();
}

export async function GET(
  request: Request
) {
  try {
    const url =
      new URL(request.url);

    const token =
      url.searchParams.get(
        "token"
      );

    const slug =
      url.searchParams.get(
        "slug"
      );

    if (!token) {
      return Response.json(
        {
          error:
            "A download token is required.",
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

    const order =
      await prisma.order.findUnique({
        where: {
          downloadToken:
            token,
        },

        include: {
          items: true,
        },
      });

    if (!order) {
      return Response.json(
        {
          error:
            "License order could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      order.paymentStatus !==
      "paid"
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

    if (
      !order.downloadExpiresAt
    ) {
      return Response.json(
        {
          error:
            "License access is unavailable.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      order.downloadExpiresAt <
      new Date()
    ) {
      return Response.json(
        {
          error:
            "This license link has expired.",
        },
        {
          status: 403,
        }
      );
    }

    const item =
      order.items.find(
        (orderItem) =>
          orderItem.beatSlug ===
          slug
      );

    if (!item) {
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

    const license =
      item.license as LicenseName;

    const validLicenses:
      LicenseName[] = [
      "MP3 Lease",
      "WAV Lease",
      "Unlimited",
      "Exclusive",
    ];

    if (
      !validLicenses.includes(
        license
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid license type.",
        },
        {
          status: 400,
        }
      );
    }

    const pdf =
      await PDFDocument.create();

    pdf.setTitle(
      `NAYRBEATS ${license} - ${item.beatTitle}`
    );

    pdf.setAuthor(
      "NAYRBEATS"
    );

    pdf.setSubject(
      "Beat License Agreement"
    );

    const regularFont =
      await pdf.embedFont(
        StandardFonts.Helvetica
      );

    const boldFont =
      await pdf.embedFont(
        StandardFonts.HelveticaBold
      );

    const page =
      pdf.addPage([
        612,
        792,
      ]);

    const pageWidth =
      page.getWidth();

    let y = 735;

    const drawText = (
      text: string,
      options?: {
        size?: number;
        bold?: boolean;
        color?: ReturnType<
          typeof rgb
        >;
        x?: number;
      }
    ) => {
      const size =
        options?.size ?? 11;

      const font =
        options?.bold
          ? boldFont
          : regularFont;

      page.drawText(
        text,
        {
          x:
            options?.x ??
            55,
          y,
          size,
          font,
          color:
            options?.color ??
            rgb(
              0.15,
              0.15,
              0.15
            ),
        }
      );

      y -=
        size + 10;
    };

    page.drawText(
      "NAYRBEATS",
      {
        x: 55,
        y,
        size: 14,
        font: boldFont,
        color: rgb(
          0.15,
          0.38,
          0.92
        ),
      }
    );

    y -= 36;

    drawText(
      "BEAT LICENSE AGREEMENT",
      {
        size: 24,
        bold: true,
      }
    );

    y -= 8;

    drawText(
      `License: ${license}`,
      {
        size: 13,
        bold: true,
        color: rgb(
          0.15,
          0.38,
          0.92
        ),
      }
    );

    y -= 18;

    page.drawLine({
      start: {
        x: 55,
        y,
      },
      end: {
        x:
          pageWidth -
          55,
        y,
      },
      thickness: 1,
      color: rgb(
        0.85,
        0.85,
        0.85
      ),
    });

    y -= 32;

    drawText(
      `Beat: ${item.beatTitle}`,
      {
        bold: true,
      }
    );

    drawText(
      `Producer: ${item.artist}`
    );

    drawText(
      `Licensee: ${
        order.customerName ||
        order.customerEmail
      }`
    );

    drawText(
      `Email: ${order.customerEmail}`
    );

    drawText(
      `Order Number: #${order.id}`
    );

    drawText(
      `Purchase Date: ${formatDate(
        order.createdAt
      )}`
    );

    drawText(
      `License Price: ${formatMoney(
        item.price,
        order.currency
      )}`
    );

    y -= 18;

    drawText(
      "LICENSE TERMS",
      {
        size: 15,
        bold: true,
      }
    );

    y -= 6;

    const terms =
      getLicenseTerms(
        license
      );

    for (
      let index = 0;
      index <
      terms.length;
      index++
    ) {
      drawText(
        `${index + 1}. ${
          terms[index]
        }`
      );
    }

    y -= 18;

    drawText(
      "GENERAL TERMS",
      {
        size: 15,
        bold: true,
      }
    );

    y -= 6;

    const generalTerms = [
      "This agreement grants the buyer the rights stated above for the purchased beat.",
      "The beat itself may not be resold, sublicensed, redistributed, or claimed as the buyer's original production.",
      "The buyer may create and commercially release new recordings using the beat within the limits of this license.",
      "NAYRBEATS retains all rights not expressly granted by this agreement.",
      "Proof of purchase and this license should be kept for the buyer's records.",
    ];

    for (
      let index = 0;
      index <
      generalTerms.length;
      index++
    ) {
      drawText(
        `${index + 1}. ${
          generalTerms[index]
        }`,
        {
          size: 10,
        }
      );
    }

    y -= 20;

    page.drawLine({
      start: {
        x: 55,
        y,
      },
      end: {
        x:
          pageWidth -
          55,
        y,
      },
      thickness: 1,
      color: rgb(
        0.85,
        0.85,
        0.85
      ),
    });

    y -= 28;

    drawText(
      "Issued electronically by NAYRBEATS",
      {
        size: 10,
        bold: true,
      }
    );

    drawText(
      `Agreement generated for Order #${order.id}.`,
      {
        size: 9,
      }
    );

    const pdfBytes =
      await pdf.save();

    const fileName =
      `${safeFileName(
        item.beatTitle
      ) || "NAYRBEATS"} - ${safeFileName(
        license
      )} License.pdf`;

    return new Response(
      new Uint8Array(
        pdfBytes
      ),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

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
      "License PDF error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate license PDF.",
      },
      {
        status: 500,
      }
    );
  }
}