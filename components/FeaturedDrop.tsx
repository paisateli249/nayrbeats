"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FeaturedDrop() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111111]"
        >
          {/* Background glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-600/25 blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-32 left-20 h-80 w-80 rounded-full bg-blue-900/25 blur-[120px]" />

          <div className="relative grid items-center gap-12 p-8 md:p-12 lg:grid-cols-2 lg:p-16">
            {/* Artwork */}
            <motion.div
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative"
            >
              <div className="absolute inset-8 rounded-[2rem] bg-blue-600/20 blur-3xl" />

              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-950 via-[#0a0a0a] to-black p-8 shadow-2xl shadow-blue-950/30">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.06] to-transparent" />

                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 w-full text-center"
                >
                  <div className="relative mx-auto h-[260px] w-[260px] sm:h-[320px] sm:w-[320px]">
                    <Image
                      src="/moneybag.png"
                      alt="NAYRBEATS Money Bag Logo"
                      fill
                      priority
                      className="object-contain p-6 drop-shadow-[0_25px_45px_rgba(37,99,235,0.25)]"
                    />
                  </div>

                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.45em] text-blue-300">
                    Featured Drop
                  </p>

                  <h2 className="mt-4 text-4xl font-black tracking-[0.16em] text-white sm:text-5xl">
                    NAYRBEATS
                  </h2>

                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.35em] text-blue-400">
                    West Coast Sound
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Information */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[17px] w-[17px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22c4.4 0 8-3.6 8-8 0-4-2-6-4-8 0 3-1 5-3 6 0-4-2-7-5-10 0 4-4 7-4 12 0 4.4 3.6 8 8 8Z" />
                </svg>

                Featured Drop
              </div>

              <h2 className="mt-7 text-4xl font-black leading-tight text-white md:text-5xl">
                Fresh production made for your next release.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                Heavy drums, smooth melodies, and authentic West Coast
                energy. Browse the newest NAYRBEATS production and choose
                the license that fits your project.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 14a8 8 0 0 1 16 0" />
                    <path d="M18 19c0 1.1-.9 2-2 2h-1v-7h3v5Z" />
                    <path d="M6 19c0 1.1.9 2 2 2h1v-7H6v5Z" />
                  </svg>

                  <h3 className="mt-4 font-bold text-white">
                    Instant Preview
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Listen before selecting your license.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 3v5" />
                    <path d="M12 16v5" />
                  </svg>

                  <h3 className="mt-4 font-bold text-white">
                    Multiple Licenses
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    MP3, WAV, unlimited, and exclusive options.
                  </p>
                </div>
              </div>

              <a
                href="#beats"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-[0_15px_40px_rgba(37,99,235,0.22)] transition hover:scale-[1.02] hover:bg-blue-500"
              >
                Shop Latest Beats

                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}