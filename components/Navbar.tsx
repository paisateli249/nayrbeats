"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "./CartProvider";

export default function Navbar() {
  const { cart, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-black tracking-[0.3em] text-white"
        >
          NAYRB
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#beats"
            className="text-sm text-gray-300 transition hover:text-blue-500"
          >
            Beats
          </a>

          <a
            href="#services"
            className="text-sm text-gray-300 transition hover:text-blue-500"
          >
            Services
          </a>

          <a
            href="#about"
            className="text-sm text-gray-300 transition hover:text-blue-500"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm text-gray-300 transition hover:text-blue-500"
          >
            Contact
          </a>
        </nav>

        {/* Cart */}
        <button
          type="button"
          onClick={toggleCart}
          aria-label="Open shopping cart"
          className="relative rounded-full border border-white/10 p-3 transition hover:border-blue-500 hover:bg-blue-500/10"
        >
          <ShoppingCart
            size={22}
            className="text-white"
          />

          {cart.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-bold text-white">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}