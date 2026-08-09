"use client";

import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Intro from "./Intro";

interface SiteShellProps {
  children: ReactNode;
}

export default function SiteShell({
  children,
}: SiteShellProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showIntro
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <Intro
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: showIntro ? 0 : 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}