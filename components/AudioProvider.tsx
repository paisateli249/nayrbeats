"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

export type Beat = {
  title: string;
  artist: string;
  audio: string;
};

type AudioContextType = {
  currentBeat: Beat | null;
  isPlaying: boolean;
  playBeat: (beat: Beat) => void;
  pauseBeat: () => void;
};

const AudioContext = createContext<AudioContextType | null>(
  null
);

export function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentBeat, setCurrentBeat] =
    useState<Beat | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const playBeat = (beat: Beat) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (
      currentBeat?.audio === beat.audio &&
      isPlaying
    ) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current.src = beat.audio;

    audioRef.current
      .play()
      .then(() => {
        setCurrentBeat(beat);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);
      });

    audioRef.current.onended = () => {
      setIsPlaying(false);
    };
  };

  const pauseBeat = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{
        currentBeat,
        isPlaying,
        playBeat,
        pauseBeat,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio must be used inside AudioProvider"
    );
  }

  return context;
}