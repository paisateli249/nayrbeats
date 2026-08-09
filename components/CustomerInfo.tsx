"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CustomerInfoProps {
  open: boolean;
  onClose: () => void;
  onContinue: (customer: {
    name: string;
    email: string;
  }) => void;
}

export default function CustomerInfo({
  open,
  onClose,
  onContinue,
}: CustomerInfoProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    onContinue({
      name: name.trim(),
      email: email.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close customer information"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#111111] p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 p-2 transition hover:border-blue-500 hover:text-blue-500"
        >
          <X size={20} />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">
          Checkout
        </p>

        <h2 className="mt-3 text-3xl font-black">
          Customer Information
        </h2>

        <p className="mt-3 text-gray-400">
          Your beat files and license will be sent to this email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="customer-name"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Full Name
            </label>

            <input
              id="customer-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your full name"
              className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="customer-email"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Email Address
            </label>

            <input
              id="customer-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@email.com"
              className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold transition hover:bg-blue-500"
          >
            Continue to Payment
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/10 py-3 font-semibold transition hover:border-blue-500"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}