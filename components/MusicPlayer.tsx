"use client";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import { useAudio } from "./AudioProvider";

export default function MusicPlayer() {
  const {
    currentBeat,
    isPlaying,
    playBeat,
    pauseBeat,
  } = useAudio();

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#090909]/95 backdrop-blur-xl">

      <div className="mx-auto max-w-7xl px-6 py-4">

        {/* Progress */}
        <div className="mb-4 h-1 w-full rounded-full bg-white/10">
          <div className="h-1 w-1/3 rounded-full bg-blue-500"></div>
        </div>

        <div className="flex items-center justify-between">

          {/* Beat Info */}
          <div>
            <h3 className="text-lg font-bold text-white">
              {currentBeat.title}
            </h3>

            <p className="text-sm text-gray-400">
              {currentBeat.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">

            <button>
              <SkipBack className="text-white hover:text-blue-500 transition" />
            </button>

            <button
              onClick={() => {
                if (isPlaying) {
                  pauseBeat();
                } else {
                  playBeat(currentBeat);
                }
              }}
              className="rounded-full bg-blue-600 p-4 hover:bg-blue-500 transition"
            >
              {isPlaying ? (
                <Pause className="text-white" />
              ) : (
                <Play fill="white" className="text-white" />
              )}
            </button>

            <button>
              <SkipForward className="text-white hover:text-blue-500 transition" />
            </button>

          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">

            <Volume2 className="text-white" />

            <div className="h-1 w-28 rounded-full bg-white/10">
              <div className="h-1 w-2/3 rounded-full bg-blue-500"></div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}