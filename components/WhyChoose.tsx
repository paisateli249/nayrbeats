"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  Headphones,
  Waves,
} from "lucide-react";

const reasons = [
  {
    icon: Waves,
    title: "Authentic West Coast Feel",
    description:
      "Heavy bounce, smooth melodies, and clean drums made for modern artists.",
  },
  {
    icon: Headphones,
    title: "Mixed for Vocals",
    description:
      "Every beat is balanced to leave room for your voice and performance.",
  },
  {
    icon: BadgeCheck,
    title: "Simple Licensing",
    description:
      "Choose the license that fits your release without confusing steps.",
  },
  {
    icon: Clock3,
    title: "Fast Delivery",
    description:
      "Get access to your selected beat and license as soon as checkout is complete.",
  },
];

export default function WhyChoose() {
  return (
    <section
      id="services"
      className="border-y border-white/10 bg-[#0c0c0c] px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
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
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-blue-500">
            Why Choose NAYRB
          </p>

          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Professional sound without the complicated process.
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-400">
            Everything is built to help independent artists
            find the right sound and move faster.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
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
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -8,
                }}
                className="rounded-3xl border border-white/10 bg-[#111111] p-7 transition hover:border-blue-500/50"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                  <Icon
                    size={26}
                    className="text-blue-500"
                  />
                </div>

                <h3 className="text-xl font-bold text-white">
                  {reason.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}