"use client";

import { motion } from "framer-motion";
import {
  Headphones,
  LockKeyhole,
  Music2,
  Sparkles,
} from "lucide-react";

export default function Vault() {
  const items = [
    {
      icon: Music2,
      title: "Premium Beats",
      description:
        "Clean, hard-hitting production built for serious releases.",
    },
    {
      icon: Headphones,
      title: "Artist Ready",
      description:
        "Every beat is mixed to leave space for vocals and performance.",
    },
    {
      icon: LockKeyhole,
      title: "Simple Licensing",
      description:
        "Choose the license that fits your project and keep moving.",
    },
    {
      icon: Sparkles,
      title: "Exclusive Sound",
      description:
        "West Coast bounce with polished melodies and professional quality.",
    },
  ];

  return (
    <section
      id="about"
      className="px-6 py-24"
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
          className="mb-12"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-blue-500">
            The Vault
          </p>

          <h2 className="max-w-3xl text-4xl font-black text-white sm:text-5xl">
            Built for artists who care about sound.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Every beat is made with bounce, space, and
            professional quality so you can focus on the
            record.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
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
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}