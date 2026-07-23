"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

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
          }}
          transition={{
            duration: 0.7,
          }}
          className="overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-blue-700 via-blue-900 to-black"
        >

          <div className="grid items-center gap-10 p-12 lg:grid-cols-2">

            {/* Left */}
            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-blue-200">
                <Flame size={16} />
                Featured Drop
              </div>

              <h2 className="text-5xl font-black leading-tight text-white">
                HIGH LIFE 90
                <span className="block text-blue-300">
                  (MOB)
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100/80">
                Smooth West Coast bounce with heavy
                drums, clean melodies, and a polished
                mix. Perfect for artists looking for
                that authentic California sound.
              </p>

              <button className="mt-10 rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105">
                Listen Now
              </button>

            </div>

            {/* Right */}
            <div className="flex justify-center">

              <motion.div
                animate={{
                  rotate: [0, 3, 0, -3, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                }}
                className="flex h-80 w-80 items-center justify-center rounded-full border border-white/20 bg-black/40 shadow-[0_0_80px_rgba(59,130,246,0.4)]"
              >
                <div className="text-center">

                  <div className="mx-auto mb-5 h-24 w-24 rounded-full bg-blue-500" />

                  <h3 className="text-3xl font-black text-white">
                    NAYRB
                  </h3>

                  <p className="mt-2 text-blue-200">
                    WEST COAST SOUND
                  </p>

                </div>
              </motion.div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}