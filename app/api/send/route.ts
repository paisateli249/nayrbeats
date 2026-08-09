import { Resend } from "resend";

import { EmailTemplate } from "@/components/email-template";

export async function POST() {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error: "RESEND_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "NAYRBEATS <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "NAYRBEATS Email Test",
      react: EmailTemplate({
        firstName: "John",
      }),
    });

    if (error) {
      return Response.json(
        {
          error,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Resend email error:", error);

    return Response.json(
      {
        error: "Unable to send email.",
      },
      {
        status: 500,
      }
    );
  }
}