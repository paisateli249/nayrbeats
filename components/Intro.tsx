"use client";

import { motion } from "framer-motion";

type IntroProps = {
  onComplete?: () => void;
};

export default function Intro({
  onComplete,
}: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#070707]"
    >
      {/* Background Glow */}
      <motion.div
        initial={{
          scale: 0.7,
          opacity: 0,
        }}
        animate={{
          scale: [0.7, 1.15, 1],
          opacity: [0, 0.7, 0.35],
        }}
        transition={{
          duration: 2.2,
          ease: "easeInOut",
        }}
        className="absolute h-[420px] w-[420px] rounded-full bg-blue-600/30 blur-[120px]"
      />

      <div className="relative text-center">
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
            delay: 0.2,
          }}
          className="mb-5 text-sm font-bold uppercase tracking-[0.45em] text-blue-500"
        >
          West Coast Sound
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            scale: 0.8,
            letterSpacing: "0.1em",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            letterSpacing: "0.28em",
          }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease: "easeOut",
          }}
          className="text-6xl font-black text-white sm:text-8xl"
        >
          NAYRB
        </motion.h1>

        <motion.div
          initial={{
            width: 0,
            opacity: 0,
          }}
          animate={{
            width: "100%",
            opacity: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 1.1,
          }}
          className="mx-auto mt-7 h-px max-w-xs bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />

        <motion.p
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 1.35,
          }}
          className="mt-5 text-sm uppercase tracking-[0.25em] text-gray-500"
        >
          Premium Beats for Independent Artists
        </motion.p>
      </div>
    </motion.div>
  );
}