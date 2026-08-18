"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function MixMasterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/mix-master-checkout",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            songTitle,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to start checkout."
        );
      }

      if (!data.url) {
        throw new Error(
          "Checkout URL was not returned."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      <div className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">
            NAYRBEATS
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-7xl">
            Mix & Master
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Professional mixing and mastering
            for artists who want clean,
            powerful, release-ready records.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-500">
                Mixing & Mastering
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-black">
                  $50
                </span>

                <span className="pb-2 text-gray-500">
                  per song
                </span>
              </div>

              <div className="mt-8 space-y-4 text-gray-300">
                <p>✓ Full vocal mix</p>
                <p>
                  ✓ EQ, compression, effects,
                  and leveling
                </p>
                <p>
                  ✓ Mastering for streaming
                  platforms
                </p>
                <p>
                  ✓ High-quality WAV export
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-sm font-bold text-blue-400">
                  $50 total
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Enter your project details,
                  then continue to secure Stripe
                  checkout.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-[#111111] p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-500">
                Book Your Session
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    required
                    placeholder="you@email.com"
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">
                    Song Title
                  </label>

                  <input
                    type="text"
                    value={songTitle}
                    onChange={(event) =>
                      setSongTitle(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Song title"
                    className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-300">
                    Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Tell me how you want the song to sound..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-blue-500"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-blue-600 px-8 py-4 font-black transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Opening Checkout..."
                    : "Continue To Checkout — $50"}
                </button>

                <p className="text-center text-xs text-gray-500">
                  Secure payment powered by
                  Stripe
                </p>
              </div>
            </form>
          </div>

          <Link
            href="/"
            className="mt-10 inline-block text-sm font-bold text-gray-500 transition hover:text-white"
          >
            ← Back To Store
          </Link>
        </div>
      </div>
    </main>
  );
}