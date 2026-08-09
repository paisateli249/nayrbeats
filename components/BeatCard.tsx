"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Music2,
  Pause,
  Play,
} from "lucide-react";

import { useAudio } from "./AudioProvider";
import LicenseModal from "./LicenseModal";

interface BeatCardProps {
  beatId: number;
  title: string;
  artist: string;
  slug: string;
  artworkUrl?: string | null;
  price: number;
  audio: string;
}

export default function BeatCard({
  beatId,
  title,
  artist,
  slug,
  artworkUrl,
  price,
  audio,
}: BeatCardProps) {
  const {
    playBeat,
    togglePlay,
    currentBeat,
    isPlaying,
  } = useAudio();

  const [open, setOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const isCurrent = currentBeat?.audio === audio;
  const isCurrentAndPlaying =
    isCurrent && isPlaying;

  async function handlePlay() {
    if (isCurrent) {
      await togglePlay();
      return;
    }

    await playBeat({
      title,
      artist,
      audio,
      price,
    });
  }

  return (
    <>
      <motion.article
        whileHover={{
          y: -10,
        }}
        transition={{
          duration: 0.3,
        }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-2xl transition hover:border-blue-500/30"
      >
        {/* Artwork */}
        <div className="group relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-black to-black">
          {/* Blue glow */}
          <div className="absolute h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-black/30" />

          {/* Favorite button */}
          <button
            type="button"
            aria-label={
              favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            onClick={() =>
              setFavorite((current) => !current)
            }
            className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/60 p-3 backdrop-blur-md transition hover:border-blue-500"
          >
            <Heart
              size={22}
              fill={favorite ? "#3b82f6" : "none"}
              className={
                favorite
                  ? "text-blue-500"
                  : "text-white"
              }
            />
          </button>

          {/* Artwork image */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
            <div className="relative h-[215px] w-[215px]">
              <Image
                src={artworkUrl ?? "/moneybag.png"}
                alt={`${title} artwork`}
                fill
                priority
                sizes="215px"
                className="object-contain transition duration-500 group-hover:scale-105"
              />
            </div>

            <p className="mt-1 text-lg font-black uppercase tracking-[0.35em] text-white">
              NAYRBEATS
            </p>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
              West Coast Sound
            </p>
          </div>

          {/* Center play button */}
          <button
            type="button"
            aria-label={
              isCurrentAndPlaying
                ? `Pause ${title}`
                : `Play ${title}`
            }
            onClick={() => {
              void handlePlay();
            }}
            className={`absolute z-20 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/95 shadow-2xl transition-all duration-300 hover:bg-blue-500 ${
              isCurrentAndPlaying
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            }`}
          >
            {isCurrentAndPlaying ? (
              <Pause
                size={34}
                fill="white"
                className="text-white"
              />
            ) : (
              <Play
                size={34}
                fill="white"
                className="ml-1 text-white"
              />
            )}
          </button>
        </div>

        {/* Beat information */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-bold text-white">
                {title}
              </h3>

              <p className="mt-2 truncate text-gray-400">
                {artist}
              </p>
            </div>

            {isCurrent && (
              <Music2
                size={25}
                className={
                  isPlaying
                    ? "animate-pulse text-blue-500"
                    : "text-blue-500"
                }
              />
            )}
          </div>

          {/* Price and actions */}
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Starting at
              </p>

              <p className="mt-1 text-2xl font-black text-blue-500">
                ${price.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  void handlePlay();
                }}
                className="flex-1 rounded-full border border-white/10 px-5 py-3 font-bold text-white transition hover:border-blue-500 hover:bg-blue-600/10 sm:flex-none"
              >
                {isCurrentAndPlaying
                  ? "Pause"
                  : "Preview"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex-1 rounded-full border border-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-600 sm:flex-none"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </motion.article>

      <LicenseModal
        open={open}
        onClose={() => setOpen(false)}
        beatId={beatId}
        slug={slug}
        artworkUrl={artworkUrl}
        title={title}
        artist={artist}
        price={price}
      />
    </>
  );
}