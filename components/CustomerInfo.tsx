"use client";

import { useState } from "react";
import { Mail, User, X } from "lucide-react";

type CustomerInfoProps = {
  open: boolean;
  onClose: () => void;
  onContinue?: (customer: {
    name: string;
    email: string;
  }) => void;
};

export default function CustomerInfo({
  open,
  onClose,
  onContinue,
}: CustomerInfoProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

    onContinue?.({
      name: name.trim(),
      email: email.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111111] p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
              Customer Details
            </p>

            <h2 className="text-3xl font-black text-white">
              Enter Your Information
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer information form"
            className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:border-blue-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="customer-name"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4">
              <User
                size={20}
                className="text-gray-500"
              />

              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="customer-email"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4">
              <Mail
                size={20}
                className="text-gray-500"
              />

              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-500"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}