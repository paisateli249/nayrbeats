"use client";

import { X } from "lucide-react";

import { useCart } from "./CartProvider";

type LicenseModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
};

const licenses = [
  {
    name: "MP3 Lease",
    price: 30,
    description:
      "MP3 file for smaller releases, demos, and streaming.",
  },
  {
    name: "WAV Lease",
    price: 60,
    description:
      "High-quality WAV file for professional releases.",
  },
  {
    name: "Unlimited License",
    price: 120,
    description:
      "Unlimited streams, sales, and distribution.",
  },
];

export default function LicenseModal({
  open,
  onClose,
  title,
}: LicenseModalProps) {
  const { addToCart } = useCart();

  if (!open) return null;

  const handleAddToCart = (
    license: string,
    price: number
  ) => {
    addToCart({
      title,
      license,
      price,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
              {title}
            </p>

            <h2 className="text-3xl font-black text-white">
              Choose a License
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close license modal"
            className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:border-blue-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {licenses.map((license) => (
            <button
              key={license.name}
              type="button"
              onClick={() =>
                handleAddToCart(
                  license.name,
                  license.price
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-blue-500 hover:bg-blue-500/10"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white">
                  {license.name}
                </h3>

                <span className="text-xl font-black text-blue-500">
                  ${license.price}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {license.description}
              </p>
            </button>
          ))}

          <a
            href="mailto:paisateli249@gmail.com?subject=Exclusive Beat License"
            className="block w-full rounded-2xl border border-yellow-500/60 bg-yellow-500/5 p-5 transition hover:bg-yellow-500/10"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-yellow-400">
                Exclusive License
              </h3>

              <span className="font-bold text-yellow-400">
                Contact
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Full ownership rights and the beat is removed
              from the store.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}