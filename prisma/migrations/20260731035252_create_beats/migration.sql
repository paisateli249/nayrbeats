-- CreateTable
CREATE TABLE "Beat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL DEFAULT 'NAYRBEATS',
    "slug" TEXT NOT NULL,
    "bpm" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT,
    "previewUrl" TEXT NOT NULL,
    "fullMp3Path" TEXT NOT NULL,
    "fullWavPath" TEXT,
    "artworkUrl" TEXT,
    "mp3Price" INTEGER NOT NULL DEFAULT 30,
    "wavPrice" INTEGER NOT NULL DEFAULT 50,
    "unlimitedPrice" INTEGER NOT NULL DEFAULT 100,
    "exclusivePrice" INTEGER NOT NULL DEFAULT 200,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Beat_slug_key" ON "Beat"("slug");
