"use client";

import { motion } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden px-6">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 py-20 lg:grid-cols-2">
        {/* Left Side */}
        <div>
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-blue-500"
          >
            West Coast Sound
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
            }}
            className="max-w-3xl text-5xl font-black leading-[0.95] text-white sm:text-7xl lg:text-8xl"
          >
            Premium Beats
            <span className="block text-blue-500">
              Made to Move.
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
            className="mt-7 max-w-xl text-lg leading-8 text-gray-400"
          >
            Hard-hitting West Coast production for
            independent artists ready to build their
            next release.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
            }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#beats"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-500"
            >
              <Play
                size={20}
                fill="white"
              />
              Browse Beats
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 font-bold text-white transition hover:border-blue-500 hover:bg-blue-500/10"
            >
              Mix & Master
            </a>
          </motion.div>
        </div>

        {/* Right Side */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            rotate: 3,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.25,
          }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="absolute -inset-6 rounded-[3rem] bg-blue-600/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-blue-700 via-blue-950 to-black p-10 shadow-2xl">
            <div className="flex min-h-[440px] flex-col justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
                  NAYRB
                </p>

                <h2 className="mt-5 text-5xl font-black leading-none text-white">
                  Sound
                  <span className="block text-blue-400">
                    Different.
                  </span>
                </h2>
              </div>

              <div>
                <div className="mb-5 h-px w-full bg-white/20" />

                <p className="text-lg font-semibold text-white">
                  New beats added regularly.
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-100/70">
                  Clean production, heavy bounce, and
                  polished mixes made for artists.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#beats"
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 transition hover:text-blue-500"
        aria-label="Scroll to beats"
      >
        <ArrowDown size={28} />
      </motion.a>
    </section>
  );
}