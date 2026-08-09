import Image from "next/image";
import Link from "next/link";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BeatsPage() {
  const beats = await prisma.beat.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#090909] px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">
              Catalog Manager
            </p>

            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              My Beats
            </h1>

            <p className="mt-3 text-gray-400">
              Preview and manage every beat in your catalog.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-fit rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-500"
          >
            + Upload New Beat
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-[#111111] p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Total Beats
          </p>

          <p className="mt-3 text-4xl font-black text-blue-500">
            {beats.length}
          </p>
        </div>

        {beats.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#111111] px-6 py-20 text-center">
            <h2 className="text-2xl font-black">
              No beats uploaded yet
            </h2>

            <p className="mt-3 text-gray-500">
              Upload your first beat from the dashboard.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-block rounded-full bg-blue-600 px-7 py-3 font-bold transition hover:bg-blue-500"
            >
              Upload Beat
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {beats.map((beat) => (
              <article
                key={beat.id}
                className="rounded-3xl border border-white/10 bg-[#111111] p-5 transition hover:border-blue-500/30"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                  <div className="relative flex h-64 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black xl:h-44 xl:w-44">
                    <Image
                      src={beat.artworkUrl ?? "/moneybag.png"}
                      alt={`${beat.title} artwork`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 176px"
                      className="object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="truncate text-2xl font-black">
                        {beat.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                          beat.published
                            ? "bg-green-500/15 text-green-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {beat.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {beat.artist} • {beat.bpm} BPM • {beat.key} •{" "}
                      {beat.genre}
                    </p>

                    {beat.description && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                        {beat.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                        MP3 ${beat.mp3Price}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                        WAV ${beat.wavPrice}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                        Unlimited ${beat.unlimitedPrice}
                      </span>

                      <span className="rounded-full border border-white/10 px-4 py-2 text-gray-300">
                        Exclusive ${beat.exclusivePrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:min-w-[340px]">
                    <audio
                      controls
                      preload="none"
                      src={beat.previewUrl}
                      className="h-10 w-full"
                    />

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/beats/${beat.slug}`}
                        className="flex-1 rounded-full border border-white/10 px-5 py-3 text-center text-sm font-bold transition hover:border-blue-500 hover:text-blue-400"
                      >
                        View
                      </Link>

                      <Link
                        href={`/dashboard/beats/${beat.id}/edit`}
                        className="flex-1 rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-bold transition hover:bg-blue-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}