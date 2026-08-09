"use client";

import { motion } from "framer-motion";

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({
  onComplete,
}: IntroProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        delay: 2,
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Blue background glow */}
      <motion.div
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1.4,
          opacity: [0, 0.45, 0],
        }}
        transition={{
          duration: 2.4,
          ease: "easeInOut",
        }}
        className="absolute h-[380px] w-[380px] rounded-full bg-blue-600 blur-[120px]"
      />

      {/* Intro content */}
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{
            opacity: 0,
            scale: 0.8,
            letterSpacing: "0.15em",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            letterSpacing: "0.32em",
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          className="pl-[0.32em] text-4xl font-black text-white sm:text-6xl md:text-7xl"
        >
          NAYRBEATS
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
            delay: 0.45,
            ease: "easeOut",
          }}
          className="mx-auto mt-5 h-px max-w-[300px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
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
            delay: 0.75,
          }}
          className="mt-5 text-xs font-bold uppercase tracking-[0.5em] text-blue-400 sm:text-sm"
        >
          West Coast Sound
        </motion.p>
      </div>
    </motion.div>
  );
}