import type { Metadata } from "next";
import "./globals.css";

import { AudioProvider } from "@/components/AudioProvider";
import { CartProvider } from "@/components/CartProvider";
import MusicPlayer from "@/components/MusicPlayer";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "NAYRBEATS",
  description: "Premium West Coast beats by NAYRBEATS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#090909] text-white">
        <AudioProvider>
          <CartProvider>
            <SiteShell>
              <main className="min-h-screen pb-28 md:pb-24">
                {children}
              </main>
            </SiteShell>

            <MusicPlayer />
          </CartProvider>
        </AudioProvider>
      </body>
    </html>
  );
}