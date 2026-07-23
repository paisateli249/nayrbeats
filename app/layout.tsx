import type { Metadata } from "next";
import "./globals.css";

import { AudioProvider } from "../components/AudioProvider";
import { CartProvider } from "../components/CartProvider";
import MusicPlayer from "../components/MusicPlayer";
import Cart from "../components/Cart";

export const metadata: Metadata = {
  title: "NAYRB",
  description: "West Coast Sound",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#090909] text-white">
        <AudioProvider>
          <CartProvider>
            {children}

            <Cart />
            <MusicPlayer />
          </CartProvider>
        </AudioProvider>
      </body>
    </html>
  );
}