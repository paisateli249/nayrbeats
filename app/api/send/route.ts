import { Resend } from "resend";

import { EmailTemplate } from "@/components/email-template";

export async function POST() {
  try {
    const apiKey =
      process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "RESEND_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const resend =
      new Resend(apiKey);

    const downloadUrl =
      "http://localhost:3000/api/download?token=test-token&slug=vizion&format=mp3";

    const licenseUrl =
      "http://localhost:3000/api/license?token=test-token&slug=vizion";

    const { data, error } =
      await resend.emails.send({
        from:
          "NAYRBEATS <orders@nayrbeats.com>",

        to: [
          "paisateli249@gmail.com",
        ],

        subject:
          "Your NAYRBEATS Purchase — Vizion",

        react: EmailTemplate({
          customerName: "Bryan",

          beatTitle: "Vizion",

          license: "MP3 Lease",

          amountPaid: "$30.00",

          downloadUrl,

          licenseUrl,

          downloadExpiresAt:
            "August 24, 2026",
        }),
      });

    if (error) {
      console.error(
        "Resend send error:",
        error
      );

      return Response.json(
        {
          error,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Resend email error:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send email.",
      },
      {
        status: 500,
      }
    );
  }
}