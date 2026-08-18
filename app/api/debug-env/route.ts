export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    stripeSecretKeyLoaded:
      Boolean(process.env.STRIPE_SECRET_KEY),

    databaseUrlLoaded:
      Boolean(process.env.DATABASE_URL),

    vercelEnvironment:
      process.env.VERCEL_ENV ?? "unknown",
  });
}