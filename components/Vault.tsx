"use client";

import { motion } from "framer-motion";

import BeatCard from "./BeatCard";

interface Beat {
  id: number;
  beatId: number;
  title: string;
  artist: string;
  slug: string;
  artworkUrl?: string | null;
  price: number;
  audio: string;
}

interface VaultProps {
  beats: Beat[];
}

export default function Vault({
  beats,
}: VaultProps) {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-700/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-12"
        >
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-500">
            The Vault
          </p>

          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Latest Beats
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
                Premium West Coast production ready for your next record.
                Preview a beat and choose the license that fits your project.
              </p>
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-600">
              Produced by NAYRBEATS
            </p>
          </div>
        </motion.div>

        {beats.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {beats.map((beat, index) => (
              <motion.div
                key={beat.id}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <BeatCard
                  beatId={beat.beatId}
                  title={beat.title}
                  artist={beat.artist}
                  slug={beat.slug}
                  artworkUrl={beat.artworkUrl}
                  price={beat.price}
                  audio={beat.audio}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-20 text-center">
            <h3 className="text-2xl font-black text-white">
              Beats coming soon
            </h3>

            <p className="mt-3 text-gray-500">
              New NAYRBEATS releases will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}