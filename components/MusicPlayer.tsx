"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useAudio } from "./AudioProvider";

function formatTime(seconds: number) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(
    seconds % 60
  );

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    currentBeat,
    isPlaying,
    currentTime,
    duration,
    volume,
    audioError,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
  } = useAudio();

  if (!currentBeat) {
    return null;
  }

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const waveformBars = [
    14, 24, 18, 32, 22, 38, 17, 29, 20,
    35, 16, 27, 21, 33, 18, 25, 14, 30,
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-[#080808]/95 text-white shadow-[0_-15px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
      {/* Blue top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <div className="absolute left-1/2 top-0 h-20 w-80 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
        {/* Desktop Player */}
        <div className="hidden grid-cols-[minmax(220px,1fr)_minmax(380px,2fr)_minmax(180px,1fr)] items-center gap-6 md:grid">
          {/* Beat information */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-lg">
              <Image
                src="/moneybag.png"
                alt={`${currentBeat.title} artwork`}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />

              {isPlaying && (
                <div className="absolute inset-0 bg-blue-600/10" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">
                {currentBeat.title}
              </p>

              <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                {currentBeat.artist}
              </p>

              {/* Animated waveform */}
              <div className="mt-2 flex h-4 items-end gap-[2px]">
                {waveformBars
                  .slice(0, 12)
                  .map((height, index) => (
                    <motion.span
                      key={`${height}-${index}`}
                      className="w-[2px] rounded-full bg-blue-500"
                      animate={
                        isPlaying
                          ? {
                              height: [
                                4,
                                height / 2,
                                height,
                                6,
                              ],
                              opacity: [
                                0.45,
                                1,
                                0.7,
                                0.45,
                              ],
                            }
                          : {
                              height: 4,
                              opacity: 0.35,
                            }
                      }
                      transition={{
                        duration:
                          0.55 +
                          (index % 4) * 0.12,
                        repeat: isPlaying
                          ? Infinity
                          : 0,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex min-w-0 flex-col items-center">
            <div className="flex items-center gap-5">
              {/* Previous */}
              <button
                type="button"
                onClick={() => {
                  void playPrevious();
                }}
                aria-label="Previous beat"
                className="text-gray-400 transition hover:scale-110 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 5h2v14H6V5Zm3.5 7L19 5.5v13L9.5 12Z" />
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                type="button"
                onClick={() => {
                  void togglePlay();
                }}
                aria-label={
                  isPlaying
                    ? "Pause beat"
                    : "Play beat"
                }
                className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition hover:scale-105 hover:bg-blue-500"
              >
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-0 blur-xl transition group-hover:opacity-40" />

                {isPlaying ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="relative h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="relative ml-0.5 h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={() => {
                  void playNext();
                }}
                aria-label="Next beat"
                className="text-gray-400 transition hover:scale-110 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 5h2v14h-2V5ZM5 5.5 14.5 12 5 18.5v-13Z" />
                </svg>
              </button>
            </div>

            {/* Progress */}
            <div className="mt-2 flex w-full items-center gap-3">
              <span className="w-10 text-right text-[11px] font-medium tabular-nums text-gray-500">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex flex-1 items-center">
                <div className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(
                    currentTime,
                    duration || 0
                  )}
                  onChange={(event) =>
                    seekTo(
                      Number(event.target.value)
                    )
                  }
                  aria-label="Seek through beat"
                  className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent accent-blue-500"
                />
              </div>

              <span className="w-10 text-[11px] font-medium tabular-nums text-gray-500">
                {formatTime(duration)}
              </span>
            </div>

            {audioError && (
              <p className="mt-1 text-xs text-red-400">
                {audioError}
              </p>
            )}
          </div>

          {/* Volume */}
          <div className="flex items-center justify-end gap-3">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {volume === 0 ? (
                <>
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <path d="m17 9 4 4" />
                  <path d="m21 9-4 4" />
                </>
              ) : (
                <>
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <path d="M15 9a4 4 0 0 1 0 6" />
                  <path d="M18 6a8 8 0 0 1 0 12" />
                </>
              )}
            </svg>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) =>
                changeVolume(
                  Number(event.target.value)
                )
              }
              aria-label="Volume"
              className="h-1 w-28 cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Mobile Player */}
        <div className="md:hidden">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#111111]">
              <Image
                src="/moneybag.png"
                alt={`${currentBeat.title} artwork`}
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">
                {currentBeat.title}
              </p>

              <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
                {currentBeat.artist}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void playPrevious();
              }}
              aria-label="Previous beat"
              className="flex h-9 w-9 items-center justify-center text-gray-400"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 5h2v14H6V5Zm3.5 7L19 5.5v13L9.5 12Z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                void togglePlay();
              }}
              aria-label={
                isPlaying
                  ? "Pause beat"
                  : "Play beat"
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_22px_rgba(37,99,235,0.4)]"
            >
              {isPlaying ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7L8 5Z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                void playNext();
              }}
              aria-label="Next beat"
              className="flex h-9 w-9 items-center justify-center text-gray-400"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16 5h2v14h-2V5ZM5 5.5 14.5 12 5 18.5v-13Z" />
              </svg>
            </button>
          </div>

          {/* Mobile Progress */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] tabular-nums text-gray-500">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex flex-1 items-center">
              <div className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={(event) =>
                  seekTo(
                    Number(event.target.value)
                  )
                }
                aria-label="Seek through beat"
                className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent accent-blue-500"
              />
            </div>

            <span className="text-[10px] tabular-nums text-gray-500">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}