import Link from "next/link";
import { Mail, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#070707]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="text-3xl font-black tracking-[0.3em] text-white"
          >
            NAYRB
          </Link>

          <p className="mt-5 max-w-sm leading-7 text-gray-400">
            Premium West Coast beats, exclusive licenses,
            and professional mix and master services.
          </p>

          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">
            West Coast Sound
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3">
            <a
              href="#beats"
              className="w-fit text-gray-400 transition hover:text-blue-500"
            >
              Beats
            </a>

            <a
              href="#services"
              className="w-fit text-gray-400 transition hover:text-blue-500"
            >
              Services
            </a>

            <a
              href="#about"
              className="w-fit text-gray-400 transition hover:text-blue-500"
            >
              About
            </a>

            <a
              href="#contact"
              className="w-fit text-gray-400 transition hover:text-blue-500"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Connect
          </h3>

          <div className="mt-5 space-y-4">
            <a
              href="mailto:paisateli249@gmail.com"
              className="flex w-fit items-center gap-3 text-gray-400 transition hover:text-blue-500"
            >
              <Mail size={20} />

              <span>paisateli249@gmail.com</span>
            </a>

            <a
              href="#"
              className="flex w-fit items-center gap-3 text-gray-400 transition hover:text-blue-500"
            >
              <span className="flex h-5 w-5 items-center justify-center text-sm font-black">
                @
              </span>

              <span>Instagram</span>
            </a>

            <a
              href="#beats"
              className="flex w-fit items-center gap-3 text-gray-400 transition hover:text-blue-500"
            >
              <Music2 size={20} />

              <span>Browse Beats</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} nayrb. All rights
            reserved.
          </p>

          <p>Built for independent artists.</p>
        </div>
      </div>
    </footer>
  );
}