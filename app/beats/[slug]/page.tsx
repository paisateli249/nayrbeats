import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BeatPurchase from "@/components/BeatPurchase";
import prisma from "@/lib/prisma";

interface BeatPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function BeatPage({
  params,
}: BeatPageProps) {
  const { slug } = await params;

  const beat = await prisma.beat.findUnique({
    where: {
      slug,
    },
  });

  if (!beat || !beat.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-gray-300 transition hover:border-blue-500 hover:text-white"
        >
          ← Back To Store
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Artwork */}
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
            <Image
              src={beat.artworkUrl ?? "/moneybag.png"}
              alt={`${beat.title} artwork`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>

          {/* Beat information */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-500">
              NAYRBEATS
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              {beat.title}
            </h1>

            <p className="mt-3 text-lg text-gray-400">
              {beat.artist}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                {beat.bpm} BPM
              </span>

              <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                {beat.key}
              </span>

              <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                {beat.genre}
              </span>
            </div>

            {beat.description && (
              <p className="mt-7 max-w-xl leading-8 text-gray-400">
                {beat.description}
              </p>
            )}

            {/* Preview */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                Preview
              </p>

              <audio
                controls
                preload="metadata"
                src={beat.previewUrl}
                className="mt-4 w-full"
              />
            </div>

            {/* License prices */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <LicenseCard
                name="MP3 Lease"
                price={beat.mp3Price}
              />

              <LicenseCard
                name="WAV Lease"
                price={beat.wavPrice}
              />

              <LicenseCard
                name="Unlimited"
                price={beat.unlimitedPrice}
              />

              <LicenseCard
                name="Exclusive"
                price={beat.exclusivePrice}
              />
            </div>

            {/* Purchase */}
            <BeatPurchase
              beatId={beat.id}
              title={beat.title}
              artist={beat.artist}
              slug={beat.slug}
              artworkUrl={beat.artworkUrl}
              mp3Price={beat.mp3Price}
              wavPrice={beat.wavPrice}
              unlimitedPrice={beat.unlimitedPrice}
              exclusivePrice={beat.exclusivePrice}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

interface LicenseCardProps {
  name: string;
  price: number;
}

function LicenseCard({
  name,
  price,
}: LicenseCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 transition hover:border-blue-500/40">
      <p className="text-sm font-bold uppercase tracking-[0.15em] text-gray-500">
        {name}
      </p>

      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-black text-white">
          ${price}
        </span>

        <span className="pb-1 text-sm text-gray-500">
          USD
        </span>
      </div>

      <div className="mt-5 h-px bg-white/10" />

      <ul className="mt-5 space-y-3 text-sm text-gray-400">
        <li>✓ Instant download</li>
        <li>✓ High-quality files</li>
        <li>✓ Secure checkout</li>
      </ul>
    </div>
  );
}