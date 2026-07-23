"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music2 } from "lucide-react";

import { useAudio } from "./AudioProvider";
import LicenseModal from "./LicenseModal";

interface BeatCardProps {
  title: string;
  artist: string;
  price: number;
  audio: string;
}

export default function BeatCard({
  title,
  artist,
  price,
  audio,
}: BeatCardProps) {
  const {
    playBeat,
    pauseBeat,
    currentBeat,
    isPlaying,
  } = useAudio();

  const [open, setOpen] = useState(false);

  const isCurrent =
    currentBeat?.audio === audio;

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]"
      >
        {/* Artwork */}
        <div className="group relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 to-black">
          <div className="absolute inset-0 bg-black/30" />

          <Music2
            size={90}
            className="relative text-white/90"
          />

          <button
            onClick={() => {
              if (isCurrent && isPlaying) {
                pauseBeat();
              } else {
                playBeat({
                  title,
                  artist,
                  audio,
                });
              }
            }}
            className="absolute bottom-6 right-6 rounded-full bg-blue-600 p-4 transition hover:scale-110 hover:bg-blue-500"
          >
            {isCurrent && isPlaying ? (
              <Pause
                size={22}
                className="text-white"
              />
            ) : (
              <Play
                size={22}
                fill="white"
                className="text-white"
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {title}
            </h3>

            <p className="text-gray-400">
              {artist}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-500">
              From ${price}
            </span>

            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>

      <LicenseModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
      />
    </>
  );
}