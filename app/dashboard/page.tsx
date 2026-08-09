import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedDrop from "@/components/FeaturedDrop";
import Vault from "@/components/Vault";
import Footer from "@/components/Footer";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DatabaseBeat = {
  id: number;
  title: string;
  artist: string;
  slug: string;
  artworkUrl: string | null;
  mp3Price: number;
  previewUrl: string;
};

export default async function Home() {
  const databaseBeats =
    (await prisma.beat.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as DatabaseBeat[];

  const beats = databaseBeats.map(
    (beat: DatabaseBeat) => ({
      id: beat.id,
      beatId: beat.id,
      title: beat.title,
      artist: beat.artist,
      slug: beat.slug,
      artworkUrl: beat.artworkUrl,
      price: beat.mp3Price,
      audio: beat.previewUrl,
    })
  );

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <Hero />

      <div id="featured">
        <FeaturedDrop />
      </div>

      <div id="beats">
        <Vault beats={beats} />
      </div>

      <Footer />
    </main>
  );
}