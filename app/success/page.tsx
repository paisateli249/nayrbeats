import Link from "next/link";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

const wavLicenses = new Set([
  "WAV Lease",
  "Unlimited",
  "Exclusive",
]);

function formatMoney(
  amountInCents: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">
          <h1 className="text-3xl font-black">
            Order Not Found
          </h1>

          <p className="mt-4 text-gray-400">
            No Stripe checkout session was provided.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-4 font-bold transition hover:bg-blue-500"
          >
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: {
      stripeSessionId: session_id,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-yellow-500/20 bg-[#111111] p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/15">
            <span className="text-3xl font-black text-yellow-400">
              !
            </span>
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-blue-500">
            NAYRBEATS
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Processing Your Order
          </h1>

          <p className="mt-4 leading-7 text-gray-400">
            Your payment was received, but the order is still being
            recorded. Refresh this page in a few seconds.
          </p>

          <a
            href={`/success?session_id=${encodeURIComponent(
              session_id
            )}`}
            className="mt-8 block w-full rounded-full bg-blue-600 px-8 py-4 text-center font-black transition hover:bg-blue-500"
          >
            Refresh Order
          </a>

          <Link
            href="/"
            className="mt-4 block w-full rounded-full border border-white/10 px-8 py-4 text-center font-bold text-gray-300 transition hover:border-blue-500 hover:text-white"
          >
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  const paid = order.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-8 shadow-2xl md:p-10">
          <div className="text-center">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                paid
                  ? "bg-green-500/15"
                  : "bg-yellow-500/15"
              }`}
            >
              {paid ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              ) : (
                <span className="text-3xl font-black text-yellow-400">
                  !
                </span>
              )}
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-blue-500">
              NAYRBEATS
            </p>

            <h1 className="mt-2 text-4xl font-black">
              {paid
                ? "Payment Successful"
                : "Payment Processing"}
            </h1>

            <p className="mt-4 text-gray-400">
              {paid
                ? "Thank you for your purchase. Your files are ready below."
                : "Your payment is still being processed."}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Receipt email:{" "}
              <span className="text-white">
                {order.customerEmail}
              </span>
            </p>
          </div>

          <div className="mt-10 flex items-center justify-between border-y border-white/10 py-6">
            <div>
              <p className="text-sm text-gray-500">
                Order Number
              </p>

              <p className="mt-1 font-black">
                #{order.id}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Total Paid
              </p>

              <p className="mt-1 text-2xl font-black">
                {formatMoney(
                  order.amountTotal,
                  order.currency
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {order.items.map((item) => {
              const includesWav = wavLicenses.has(
                item.license
              );

              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
                        {item.license}
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {item.beatTitle}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.artist}
                      </p>
                    </div>

                    <p className="text-xl font-black">
                      {formatMoney(
                        item.price * 100,
                        order.currency
                      )}
                    </p>
                  </div>

                  {paid && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <a
                        href={`/api/download?session_id=${encodeURIComponent(
                          session_id
                        )}&slug=${encodeURIComponent(
                          item.beatSlug
                        )}&format=mp3`}
                        className="rounded-full bg-blue-600 px-6 py-4 text-center font-black text-white transition hover:bg-blue-500"
                      >
                        Download MP3
                      </a>

                      {includesWav && (
                        <a
                          href={`/api/download?session_id=${encodeURIComponent(
                            session_id
                          )}&slug=${encodeURIComponent(
                            item.beatSlug
                          )}&format=wav`}
                          className="rounded-full border border-blue-500 px-6 py-4 text-center font-black text-white transition hover:bg-blue-600/20"
                        >
                          Download WAV
                        </a>
                      )}
                    </div>
                  )}

                  {item.license === "Exclusive" && (
                    <p className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-300">
                      This beat was purchased exclusively and has been
                      removed from the public store.
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          <Link
            href="/"
            className="mt-8 block w-full rounded-full border border-white/10 px-8 py-4 text-center font-bold text-gray-300 transition hover:border-blue-500 hover:text-white"
          >
            Back To Store
          </Link>
        </div>
      </div>
    </main>
  );
}