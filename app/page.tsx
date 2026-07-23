"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedDrop from "../components/FeaturedDrop";
import Vault from "../components/Vault";
import WhyChoose from "../components/WhyChoose";
import Stats from "../components/Stats";
import SearchBar from "../components/SearchBar";
import BeatCard from "../components/BeatCard";
import Footer from "../components/Footer";
import Intro from "../components/Intro";

import { beats } from "../data/beats";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredBeats = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return beats;
    }

    return beats.filter((beat) => {
      return (
        beat.title.toLowerCase().includes(searchValue) ||
        beat.artist.toLowerCase().includes(searchValue)
      );
    });
  }, [search]);

  return (
    <>
      {showIntro && <Intro />}

      <main
        className={`min-h-screen overflow-hidden bg-[#090909] pb-32 text-white transition-all duration-700 ${
          showIntro
            ? "scale-[0.98] opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        <Navbar />

        <Hero />

        <FeaturedDrop />

        <Vault />

        <section
          id="beats"
          className="px-6 py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-blue-500">
                Beat Store
              </p>

              <h2 className="text-4xl font-black text-white sm:text-5xl">
                Latest Beats
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-400">
                Find your next sound, preview the beat,
                and choose the license that fits your
                release.
              </p>
            </div>

            <SearchBar
              search={search}
              setSearch={setSearch}
            />

            {filteredBeats.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredBeats.map((beat) => (
                  <BeatCard
                    key={beat.audio}
                    title={beat.title}
                    artist={beat.artist}
                    price={beat.price}
                    audio={beat.audio}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-16 text-center">
                <h3 className="text-2xl font-bold text-white">
                  No beats found
                </h3>

                <p className="mt-3 text-gray-400">
                  Try searching for another beat or artist.
                </p>
              </div>
            )}
          </div>
        </section>

        <WhyChoose />

        <Stats />

        <Footer />
      </main>
    </>
  );
}