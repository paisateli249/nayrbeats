"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#070707] px-6 pb-10 pt-20"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-700/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-4"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition duration-300 group-hover:border-blue-500/60">
                <Image
                  src="/moneybag.png"
                  alt="NAYRBEATS money bag logo"
                  fill
                  sizes="80px"
                  className="object-contain p-2 transition duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-[0.15em] text-white sm:text-3xl">
                  NAYRBEATS
                </h2>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.35em] text-blue-500">
                  West Coast Sound
                </p>
              </div>
            </Link>

            <p className="mt-7 max-w-lg leading-7 text-gray-400">
              Premium West Coast beats, mixing and mastering,
              exclusive licenses, and professional production for
              artists ready to level up.
            </p>

            {/* Social icons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NAYRBEATS Instagram"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600/20"
              >
                <svg
                  className="h-6 w-6 text-white transition group-hover:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7Zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10Zm-5 2.8A5.2 5.2 0 1 0 12 17.2 5.2 5.2 0 0 0 12 6.8Zm0 2A3.2 3.2 0 1 1 12 15.2 3.2 3.2 0 0 1 12 8.8Zm5.3-3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
                </svg>
              </a>

              <a
                href="https://tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NAYRBEATS TikTok"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600/20"
              >
                <svg
                  className="h-6 w-6 text-white transition group-hover:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16.6 2c.3 2.7 1.8 4.4 4.4 4.6v3.1c-1.7.1-3.2-.4-4.4-1.3v6.3c0 4-3.2 7.3-7.3 7.3S2 18.7 2 14.7s3.2-7.3 7.3-7.3c.4 0 .8 0 1.2.1v3.3a4 4 0 0 0-1.2-.2 4.1 4.1 0 1 0 4.1 4.1V2h3.2Z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NAYRBEATS YouTube"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600/20"
              >
                <svg
                  className="h-6 w-6 text-white transition group-hover:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23 12c0-2.1-.2-4.2-.5-6.3-.2-1.2-1.1-2.1-2.3-2.4C17.5 3 14.7 3 12 3s-5.5 0-8.2.3C2.6 3.6 1.7 4.5 1.5 5.7 1.2 7.8 1 9.9 1 12s.2 4.2.5 6.3c.2 1.2 1.1 2.1 2.3 2.4 2.7.3 5.5.3 8.2.3s5.5 0 8.2-.3c1.2-.3 2.1-1.2 2.3-2.4.3-2.1.5-4.2.5-6.3ZM10 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">
              Explore
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              <a
                href="#beats"
                className="w-fit text-gray-400 transition hover:translate-x-1 hover:text-blue-400"
              >
                Browse Beats
              </a>

              <a
                href="#featured"
                className="w-fit text-gray-400 transition hover:translate-x-1 hover:text-blue-400"
              >
                Featured Drop
              </a>

              <a
                href="#services"
                className="w-fit text-gray-400 transition hover:translate-x-1 hover:text-blue-400"
              >
                Mix & Master
              </a>

              <a
                href="#contact"
                className="w-fit text-gray-400 transition hover:translate-x-1 hover:text-blue-400"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">
              Contact
            </h3>

            <p className="mt-6 text-sm leading-6 text-gray-500">
              Beats, mixing, mastering, and business inquiries.
            </p>

            <a
              href="mailto:nayrbeats@gmail.com"
              className="mt-5 block break-all font-bold text-white transition hover:text-blue-400"
            >
              nayrbeats@gmail.com
            </a>

            <a
              href="mailto:nayrbeats@gmail.com?subject=NAYRBEATS%20Inquiry"
              className="mt-8 inline-block rounded-full bg-blue-600 px-7 py-3 font-bold text-white shadow-[0_12px_35px_rgba(37,99,235,0.2)] transition hover:scale-[1.02] hover:bg-blue-500"
            >
              Send Message
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-gray-500">
            © {currentYear} NAYRBEATS. All rights reserved.
          </p>

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-600">
            West Coast Sound
          </p>
        </div>
      </div>
    </footer>
  );
}