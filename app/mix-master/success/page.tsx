import Link from "next/link";

import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface MixMasterSuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

function formatMoney(
  amountInCents: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency:
        currency.toUpperCase(),
    }
  ).format(
    amountInCents / 100
  );
}

export default async function MixMasterSuccessPage({
  searchParams,
}: MixMasterSuccessPageProps) {
  const {
    session_id,
  } = await searchParams;

  if (!session_id) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center px-6 py-20">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">
            <h1 className="text-4xl font-black">
              Booking Not Found
            </h1>

            <p className="mt-5 text-gray-400">
              No Stripe checkout session was provided.
            </p>

            <Link
              href="/mix-master"
              className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-4 font-black transition hover:bg-blue-500"
            >
              Back To Mix & Master
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const order =
    await prisma.mixMasterOrder.findUnique({
      where: {
        stripeSessionId:
          session_id,
      },
    });

  if (!order) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center px-6 py-20">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/15 text-2xl font-black text-yellow-400">
              !
            </div>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-blue-500">
              NAYRBEATS
            </p>

            <h1 className="mt-4 text-4xl font-black">
              Processing Booking
            </h1>

            <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-400">
              Your payment was received, but your booking is still being saved.
              Refresh this page in a few seconds.
            </p>

            <a
              href={`/mix-master/success?session_id=${encodeURIComponent(
                session_id
              )}`}
              className="mt-8 block rounded-full bg-blue-600 px-8 py-4 font-black transition hover:bg-blue-500"
            >
              Refresh Booking
            </a>
          </div>
        </div>
      </main>
    );
  }

  const uploadUrl =
    `/mix-master/upload` +
    `?orderId=${encodeURIComponent(
      String(
        order.id
      )
    )}` +
    `&email=${encodeURIComponent(
      order.customerEmail
    )}`;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-black">
            ✓
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-blue-500">
            NAYRBEATS
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Booking Received
          </h1>

          <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-400">
            Your Mix & Master payment was successful. Your project details
            have been received.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                  Mix & Master
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {order.songTitle}
                </h2>
              </div>

              <p className="text-xl font-black">
                {formatMoney(
                  order.amountTotal,
                  order.currency
                )}
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <p>
                Order:{" "}
                <span className="font-bold text-white">
                  #{order.id}
                </span>
              </p>

              <p>
                Name:{" "}
                <span className="font-bold text-white">
                  {order.customerName}
                </span>
              </p>

              <p>
                Email:{" "}
                <span className="font-bold text-white">
                  {order.customerEmail}
                </span>
              </p>

              <p>
                Status:{" "}
                <span className="font-bold capitalize text-green-400">
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <p className="font-bold text-white">
              Next step
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Upload your stems, WAVs, references, or ZIP folder now so
              NAYRBEATS can start your project.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={uploadUrl}
              className="rounded-full bg-blue-600 px-8 py-4 font-black transition hover:bg-blue-500"
            >
              Upload Your Files
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="rounded-full border border-white/10 px-8 py-4 font-black transition hover:border-white/30"
              >
                Back To Store
              </Link>

              <Link
                href="/mix-master"
                className="rounded-full border border-white/10 px-8 py-4 font-black transition hover:border-white/30"
              >
                Mix & Master
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}