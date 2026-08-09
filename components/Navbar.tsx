"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Cart from "./Cart";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#090909]/95 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-white/5 bg-[#090909]/80 backdrop-blur-lg"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition duration-300 group-hover:border-blue-500/60">
            <div className="pointer-events-none absolute inset-0 bg-blue-600/10 opacity-0 blur-xl transition group-hover:opacity-100" />

            <Image
              src="/moneybag.png"
              alt="NAYRBEATS logo"
              fill
              sizes="48px"
              priority
              className="relative object-contain p-1.5 transition duration-300 group-hover:scale-105"
            />
          </div>

          <div>
            <p className="text-lg font-black tracking-[0.16em] text-white sm:text-xl">
              NAYRBEATS
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-blue-500">
              West Coast Sound
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#beats"
            className="relative text-sm font-bold text-gray-400 transition hover:text-white"
          >
            Beats
          </a>

          <a
            href="#featured"
            className="relative text-sm font-bold text-gray-400 transition hover:text-white"
          >
            Featured
          </a>

          <a
            href="#services"
            className="relative text-sm font-bold text-gray-400 transition hover:text-white"
          >
            Mix & Master
          </a>

          <a
            href="#contact"
            className="relative text-sm font-bold text-gray-400 transition hover:text-white"
          >
            Contact
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Cart />

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((previous) => !previous);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-blue-500 hover:bg-blue-500/10 md:hidden"
          >
            {mobileMenuOpen ? (
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
            ) : (
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
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-[#090909]/98 transition-all duration-300 md:hidden ${
          mobileMenuOpen
            ? "max-h-96 border-t border-white/10 opacity-100"
            : "max-h-0 border-t border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4">
          <a
            href="#beats"
            onClick={closeMenu}
            className="border-b border-white/10 py-4 font-bold text-gray-300 transition hover:pl-2 hover:text-blue-400"
          >
            Browse Beats
          </a>

          <a
            href="#featured"
            onClick={closeMenu}
            className="border-b border-white/10 py-4 font-bold text-gray-300 transition hover:pl-2 hover:text-blue-400"
          >
            Featured Drop
          </a>

          <a
            href="#services"
            onClick={closeMenu}
            className="border-b border-white/10 py-4 font-bold text-gray-300 transition hover:pl-2 hover:text-blue-400"
          >
            Mix & Master
          </a>

          <a
            href="#contact"
            onClick={closeMenu}
            className="py-4 font-bold text-gray-300 transition hover:pl-2 hover:text-blue-400"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}