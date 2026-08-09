export interface Beat {
  id: number;
  title: string;
  artist: string;
  price: number;
  audio: string;
  bpm?: number;
  key?: string;
  tags?: string[];
}

const beats: Beat[] = [
  {
    id: 1,
    title: "HIGH LIFE 90 (MOB)",
    artist: "NAYRBEATS",
    price: 30,
    audio: "/audio/high-life.mp3",
    bpm: 90,
    key: "C Minor",
    tags: [
      "West Coast",
      "EBK",
      "Bay Area",
      "Mob Music",
    ],
  },

  // Add more beats below like this:
  //
  // {
  //   id: 2,
  //   title: "YOUR NEXT BEAT",
  //   artist: "NAYRBEATS",
  //   price: 30,
  //   audio: "/audio/your-beat.mp3",
  //   bpm: 95,
  //   key: "G Minor",
  //   tags: [
  //     "West Coast",
  //     "Bay Area",
  //   ],
  // },
];

export default beats;