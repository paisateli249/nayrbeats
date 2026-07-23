"use client";

import { motion } from "framer-motion";

const stats = [
  {
    number: "100+",
    label: "Premium Beats",
  },
  {
    number: "100%",
    label: "West Coast Sound",
  },
  {
    number: "24/7",
    label: "Instant Delivery",
  },
  {
    number: "∞",
    label: "Creative Possibilities",
  },
];

export default function Stats() {
  return (
    <section className="px-6 py-24">
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
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >

          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
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
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
              }}
              className="rounded-3xl border border-white/10 bg-[#111111] p-10 text-center"
            >

              <h3 className="text-5xl font-black text-blue-500">
                {stat.number}
              </h3>

              <p className="mt-4 text-lg text-gray-400">
                {stat.label}
              </p>

            </motion.div>
          ))}

        </motion.div>

      </div>
    </section>
  );
}