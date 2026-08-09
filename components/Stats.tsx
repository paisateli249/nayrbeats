"use client";

import { motion } from "framer-motion";
import { Headphones, Music2, ShieldCheck, Zap } from "lucide-react";

const stats = [
  {
    icon: Music2,
    value: "100%",
    label: "Original Beats",
  },
  {
    icon: Headphones,
    value: "HQ",
    label: "Studio Quality",
  },
  {
    icon: Zap,
    value: "Instant",
    label: "Digital Delivery",
  },
  {
    icon: ShieldCheck,
    value: "Secure",
    label: "Licensing",
  },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-700/10 blur-[150px]" />

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
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                }}
                className="group relative flex min-h-[210px] flex-col items-center justify-center border-white/10 px-6 py-10 text-center sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 bg-blue-600/0 transition duration-500 group-hover:bg-blue-600/[0.06]" />

                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.12)] transition duration-300 group-hover:scale-110 group-hover:border-blue-400/40">
                  <Icon size={24} />
                </div>

                <p className="relative text-3xl font-black tracking-tight text-white">
                  {stat.value}
                </p>

                <p className="relative mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/40">
                  {stat.label}
                </p>

                <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-blue-500 transition-all duration-500 group-hover:w-2/3" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}