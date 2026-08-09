"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden px-6 py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-700/20 blur-[130px]" />

        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-900/20 blur-[100px]" />

        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-blue-600/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Left side */}
        <motion.div
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
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

            West Coast Sound
          </div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="mt-8 text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl"
          >
            NAYRBEATS
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
              delay: 0.25,
              ease: "easeOut",
            }}
            className="mt-5 text-lg font-bold uppercase tracking-[0.35em] text-blue-500 sm:text-xl"
          >
            West Coast Sound
          </motion.p>

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
              delay: 0.35,
              ease: "easeOut",
            }}
            className="mt-8 max-w-xl text-lg leading-8 text-gray-400"
          >
            Premium West Coast beats with hard drums, smooth melodies,
            and industry-quality production. Find the sound for your next
            record.
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
              ease: "easeOut",
            }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#beats"
              className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-[0_15px_40px_rgba(37,99,235,0.25)] transition hover:scale-[1.02] hover:bg-blue-500"
            >
              Shop Beats

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

            <a
              href="#services"
              className="rounded-full border border-white/10 px-8 py-4 font-bold text-white transition hover:border-blue-500 hover:bg-blue-500/10"
            >
              Mix & Master
            </a>
          </motion.div>
        </motion.div>

        {/* Right side */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
            x: 40,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative flex justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[100px]"
          />

          <div className="relative flex h-[420px] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-blue-950 via-[#0b0b0b] to-black shadow-2xl sm:h-[520px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_60%)]" />

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]"
            >
              <Image
                src="/moneybag.png"
                alt="NAYRBEATS Money Bag Logo"
                fill
                priority
                className="object-contain p-8 drop-shadow-[0_25px_50px_rgba(37,99,235,0.35)]"
              />
            </motion.div>

            <div className="absolute bottom-10 z-20 text-center sm:bottom-12">
              <h2 className="text-2xl font-black tracking-[0.2em] text-white sm:text-4xl">
                NAYRBEATS
              </h2>

              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">
                West Coast Sound
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}