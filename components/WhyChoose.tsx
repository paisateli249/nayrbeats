"use client";

import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Download,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "Industry Quality",
    description:
      "Every beat is mixed, polished, and ready for recording right away.",
  },
  {
    icon: Download,
    title: "Instant Delivery",
    description:
      "Your files are delivered immediately after your purchase is complete.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Licensing",
    description:
      "Choose the license that fits your release with simple terms and no confusion.",
  },
  {
    icon: BadgeDollarSign,
    title: "Artist Friendly",
    description:
      "Professional production and flexible licensing without overpriced packages.",
  },
];

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-28">
      {/* Background lighting */}

      <div className="pointer-events-none absolute -left-48 top-20 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[160px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}

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
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-400">
            The NAYRBEATS Difference
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Built for artists who
            <span className="block bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">
              take their sound seriously.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
            Premium West Coast production, simple licensing, and everything
            you need to turn an idea into a finished record.
          </p>
        </motion.div>

        {/* Feature cards */}

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
              >
                {/* Hover background */}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-600/0 to-blue-600/0 transition duration-500 group-hover:from-blue-600/[0.10] group-hover:to-transparent" />

                {/* Top glow line */}

                <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/0 to-transparent transition duration-500 group-hover:via-blue-400/70" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-[0_0_35px_rgba(37,99,235,0.12)] transition duration-300 group-hover:scale-110 group-hover:border-blue-400/40 group-hover:bg-blue-500/15">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-7 text-xl font-black text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-7 text-white/45">
                    {feature.description}
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <div className="h-px w-8 bg-blue-500/60 transition-all duration-300 group-hover:w-12" />

                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400/80">
                      NAYRBEATS
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}