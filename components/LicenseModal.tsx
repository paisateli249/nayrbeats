"use client";

import { useEffect } from "react";

import { useCart } from "./CartProvider";

interface LicenseModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;

  beatId?: number;
  slug?: string;
  artworkUrl?: string | null;

  title?: string;
  beatTitle?: string;
  artist?: string;

  price?: number;
  mp3Price?: number;
  wavPrice?: number;
  unlimitedPrice?: number;
  exclusivePrice?: number;
}

interface LicenseOption {
  name: string;
  description: string;
  price: number;
  features: string[];
  featured?: boolean;
}

export default function LicenseModal({
  open,
  isOpen,
  onClose,

  beatId,
  slug = "",
  artworkUrl,

  title,
  beatTitle,
  artist = "NAYRBEATS",

  price,
  mp3Price,
  wavPrice = 50,
  unlimitedPrice = 100,
  exclusivePrice = 200,
}: LicenseModalProps) {
  const { addToCart } = useCart();

  const modalOpen = open ?? isOpen ?? false;

  const displayedTitle =
    title ?? beatTitle ?? "NAYRBEATS Beat";

  const displayedSlug =
    slug ||
    displayedTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const startingPrice =
    mp3Price ?? price ?? 30;

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [modalOpen, onClose]);

  const licenses: LicenseOption[] = [
    {
      name: "MP3 Lease",
      description:
        "Perfect for starting artists.",
      price: startingPrice,
      features: [
        "Untagged MP3 file",
        "Use for one music video",
        "Up to 50,000 streams",
        "Non-exclusive license",
      ],
    },
    {
      name: "WAV Lease",
      description:
        "High-quality files for official releases.",
      price: wavPrice,
      featured: true,
      features: [
        "Untagged MP3 and WAV",
        "Use for one music video",
        "Up to 150,000 streams",
        "Non-exclusive license",
      ],
    },
    {
      name: "Unlimited",
      description:
        "Maximum freedom for your release.",
      price: unlimitedPrice,
      features: [
        "MP3, WAV, and stems",
        "Unlimited music videos",
        "Unlimited streams",
        "Non-exclusive license",
      ],
    },
    {
      name: "Exclusive",
      description:
        "Own the beat exclusively.",
      price: exclusivePrice,
      features: [
        "Exclusive ownership",
        "MP3, WAV, and stems",
        "Unlimited streams",
        "Unlimited music videos",
        "Beat removed from the store",
      ],
    },
  ];

  if (!modalOpen) {
    return null;
  }

  function handleAddToCart(
    license: LicenseOption
  ) {
    addToCart({
      beatId,
      title: displayedTitle,
      artist,
      slug: displayedSlug,
      artworkUrl,
      license: license.name,
      price: license.price,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 py-8">
      {/* Background overlay */}
      <button
        type="button"
        aria-label="Close license modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
      />

      {/* Modal */}
      <div className="relative z-10 max-h-full w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-white/10 bg-[#0b0b0b]/95 px-6 py-6 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">
              NAYRBEATS
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Choose Your License
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {displayedTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-blue-500 hover:text-blue-400"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* License cards */}
        <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2 xl:grid-cols-4">
          {licenses.map((license) => (
            <article
              key={license.name}
              className={`relative flex flex-col rounded-3xl border p-6 ${
                license.featured
                  ? "border-blue-500 bg-blue-600/10 shadow-[0_20px_60px_rgba(37,99,235,0.12)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {license.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}

              <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-500">
                License
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                {license.name}
              </h3>

              <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
                {license.description}
              </p>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-black text-white">
                  ${license.price}
                </span>

                <span className="pb-1 text-sm text-gray-500">
                  USD
                </span>
              </div>

              <div className="my-6 h-px bg-white/10" />

              <ul className="flex-1 space-y-4">
                {license.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() =>
                  handleAddToCart(license)
                }
                className={`mt-8 w-full rounded-full px-5 py-3.5 text-sm font-black transition ${
                  license.featured
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "border border-white/10 bg-white/5 text-white hover:border-blue-500 hover:bg-blue-600/10"
                }`}
              >
                Add {license.name} To Cart
              </button>
            </article>
          ))}
        </div>

        <div className="border-t border-white/10 px-6 py-6 sm:px-8">
          <p className="text-center text-xs leading-6 text-gray-600">
            All licenses are non-exclusive except the
            Exclusive license. License terms are delivered
            after checkout.
          </p>
        </div>
      </div>
    </div>
  );
}