"use client";

import { useState } from "react";

import LicenseModal from "./LicenseModal";

interface BeatPurchaseProps {
  beatId?: number;
  title: string;
  artist: string;
  slug: string;
  artworkUrl?: string | null;
  mp3Price: number;
  wavPrice: number;
  unlimitedPrice: number;
  exclusivePrice: number;
}

export default function BeatPurchase({
  beatId,
  title,
  artist,
  slug,
  artworkUrl,
  mp3Price,
  wavPrice,
  unlimitedPrice,
  exclusivePrice,
}: BeatPurchaseProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 w-full rounded-full bg-blue-600 px-8 py-4 font-black text-white transition hover:bg-blue-500"
      >
        Choose License
      </button>

      <LicenseModal
        open={open}
        onClose={() => setOpen(false)}
        beatId={beatId}
        slug={slug}
        artworkUrl={artworkUrl}
        title={title}
        artist={artist}
        mp3Price={mp3Price}
        wavPrice={wavPrice}
        unlimitedPrice={unlimitedPrice}
        exclusivePrice={exclusivePrice}
      />
    </>
  );
}