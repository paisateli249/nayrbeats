"use client";

import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import beats from "@/data/beats";

export interface Beat {
  id?: number;
  title: string;
  artist: string;
  audio: string;
  price?: number;
}

interface AudioContextType {
  currentBeat: Beat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioError: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;

  playBeat: (beat: Beat) => Promise<void>;
  pauseBeat: () => void;
  togglePlay: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seekTo: (time: number) => void;
  changeVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

const playlist: Beat[] = beats.map((beat) => ({
  id: beat.id,
  title: beat.title,
  artist: beat.artist,
  audio: beat.audio,
  price: beat.price,
}));

export function AudioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentBeat, setCurrentBeat] =
    useState<Beat | null>(null);

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(0.8);

  const [audioError, setAudioError] =
    useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  const loadAndPlay = useCallback(
    async (beat: Beat, index: number) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      try {
        setAudioError(null);
        setCurrentBeat(beat);
        setCurrentIndex(index);
        setCurrentTime(0);
        setDuration(0);

        audio.pause();
        audio.src = beat.audio;
        audio.load();

        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        setIsPlaying(false);

        const message =
          error instanceof Error
            ? error.message
            : "Audio could not be played.";

        setAudioError(message);

        console.error(
          `Failed to play audio: ${beat.audio}`,
          error
        );
      }
    },
    []
  );

  const playBeat = useCallback(
    async (beat: Beat) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      const beatIndex = playlist.findIndex(
        (playlistBeat) =>
          playlistBeat.audio === beat.audio
      );

      const resolvedIndex =
        beatIndex >= 0 ? beatIndex : currentIndex;

      const isSameBeat =
        currentBeat?.audio === beat.audio;

      if (isSameBeat) {
        try {
          setAudioError(null);
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          setIsPlaying(false);

          console.error(
            `Failed to resume audio: ${beat.audio}`,
            error
          );
        }

        return;
      }

      await loadAndPlay(beat, resolvedIndex);
    },
    [currentBeat, currentIndex, loadAndPlay]
  );

  const pauseBeat = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (!currentBeat) {
      if (playlist.length > 0) {
        await loadAndPlay(playlist[0], 0);
      }

      return;
    }

    if (isPlaying) {
      pauseBeat();
      return;
    }

    await playBeat(currentBeat);
  }, [
    currentBeat,
    isPlaying,
    loadAndPlay,
    pauseBeat,
    playBeat,
  ]);

  const playNext = useCallback(async () => {
    if (playlist.length === 0) {
      return;
    }

    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + 1) % playlist.length;

    await loadAndPlay(
      playlist[nextIndex],
      nextIndex
    );
  }, [currentIndex, loadAndPlay]);

  const playPrevious =
    useCallback(async () => {
      const audio = audioRef.current;

      if (!audio || playlist.length === 0) {
        return;
      }

      // Spotify-style behavior:
      // Restart current song when more than 3 seconds in.
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        setCurrentTime(0);
        return;
      }

      const previousIndex =
        currentIndex <= 0
          ? playlist.length - 1
          : currentIndex - 1;

      await loadAndPlay(
        playlist[previousIndex],
        previousIndex
      );
    }, [currentIndex, loadAndPlay]);

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;

    if (!audio || Number.isNaN(time)) {
      return;
    }

    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback(
    (newVolume: number) => {
      const audio = audioRef.current;

      const safeVolume = Math.min(
        1,
        Math.max(0, newVolume)
      );

      setVolume(safeVolume);

      if (audio) {
        audio.volume = safeVolume;
      }
    },
    []
  );

  return (
    <AudioContext.Provider
      value={{
        currentBeat,
        isPlaying,
        currentTime,
        duration,
        volume,
        audioError,
        audioRef,
        playBeat,
        pauseBeat,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        changeVolume,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          setCurrentTime(
            event.currentTarget.currentTime
          );
        }}
        onLoadedMetadata={(event) => {
          const loadedDuration =
            event.currentTarget.duration;

          setDuration(
            Number.isFinite(loadedDuration)
              ? loadedDuration
              : 0
          );
        }}
        onDurationChange={(event) => {
          const updatedDuration =
            event.currentTarget.duration;

          setDuration(
            Number.isFinite(updatedDuration)
              ? updatedDuration
              : 0
          );
        }}
        onEnded={() => {
          void playNext();
        }}
        onError={() => {
          const audio = audioRef.current;

          setIsPlaying(false);
          setAudioError(
            "This audio file could not be loaded."
          );

          console.error(
            "Audio failed to load:",
            audio?.currentSrc ||
              currentBeat?.audio
          );
        }}
      />
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