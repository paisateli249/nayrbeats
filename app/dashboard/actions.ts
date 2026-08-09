"use server";

import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export interface PublishBeatState {
  success: boolean;
  message: string;
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (extension) {
    return extension;
  }

  if (file.type === "audio/mpeg") {
    return ".mp3";
  }

  if (file.type === "audio/wav" || file.type === "audio/x-wav") {
    return ".wav";
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}

async function saveFile(file: File, destination: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await fs.writeFile(destination, buffer);
}

export async function publishBeat(
  _previousState: PublishBeatState,
  formData: FormData
): Promise<PublishBeatState> {
  try {
    const title = String(formData.get("title") ?? "").trim();
    const artist = String(
      formData.get("artist") ?? "NAYRBEATS"
    ).trim();
    const bpm = Number(formData.get("bpm"));
    const musicalKey = String(formData.get("key") ?? "").trim();
    const genre = String(formData.get("genre") ?? "").trim();
    const description = String(
      formData.get("description") ?? ""
    ).trim();

    const mp3Price = Number(formData.get("mp3Price"));
    const wavPrice = Number(formData.get("wavPrice"));
    const unlimitedPrice = Number(
      formData.get("unlimitedPrice")
    );
    const exclusivePrice = Number(
      formData.get("exclusivePrice")
    );

    const preview = formData.get("preview");
    const fullMp3 = formData.get("fullMp3");
    const fullWav = formData.get("fullWav");
    const artwork = formData.get("artwork");

    if (!title || !artist || !bpm || !musicalKey || !genre) {
      return {
        success: false,
        message: "Please complete all required beat information.",
      };
    }

    if (!(preview instanceof File) || preview.size === 0) {
      return {
        success: false,
        message: "Please choose a preview MP3.",
      };
    }

    if (!(fullMp3 instanceof File) || fullMp3.size === 0) {
      return {
        success: false,
        message: "Please choose the full MP3.",
      };
    }

    const baseSlug = createSlug(title);

    const existingBeat = await prisma.beat.findUnique({
      where: {
        slug: baseSlug,
      },
    });

    const slug = existingBeat
      ? `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`
      : baseSlug;

    const publicPreviewDirectory = path.join(
      process.cwd(),
      "public",
      "audio",
      slug
    );

    const publicArtworkDirectory = path.join(
      process.cwd(),
      "public",
      "artwork",
      slug
    );

    const privateDownloadDirectory = path.join(
      process.cwd(),
      "private",
      "downloads",
      slug
    );

    await fs.mkdir(publicPreviewDirectory, {
      recursive: true,
    });

    await fs.mkdir(publicArtworkDirectory, {
      recursive: true,
    });

    await fs.mkdir(privateDownloadDirectory, {
      recursive: true,
    });

    const previewExtension = getFileExtension(preview);
    const previewFileName = `preview${previewExtension}`;
    const previewFilePath = path.join(
      publicPreviewDirectory,
      previewFileName
    );

    await saveFile(preview, previewFilePath);

    const fullMp3Extension = getFileExtension(fullMp3);
    const fullMp3FileName = `${slug}${fullMp3Extension}`;
    const fullMp3FilePath = path.join(
      privateDownloadDirectory,
      fullMp3FileName
    );

    await saveFile(fullMp3, fullMp3FilePath);

    let fullWavPath: string | null = null;

    if (fullWav instanceof File && fullWav.size > 0) {
      const fullWavExtension = getFileExtension(fullWav);
      const fullWavFileName = `${slug}${fullWavExtension}`;
      const fullWavFilePath = path.join(
        privateDownloadDirectory,
        fullWavFileName
      );

      await saveFile(fullWav, fullWavFilePath);

      fullWavPath = fullWavFilePath;
    }

    let artworkUrl: string | null = null;

    if (artwork instanceof File && artwork.size > 0) {
      const artworkExtension = getFileExtension(artwork);
      const artworkFileName = `cover${artworkExtension}`;
      const artworkFilePath = path.join(
        publicArtworkDirectory,
        artworkFileName
      );

      await saveFile(artwork, artworkFilePath);

      artworkUrl = `/artwork/${slug}/${artworkFileName}`;
    }

    await prisma.beat.create({
      data: {
        title,
        artist,
        slug,
        bpm,
        key: musicalKey,
        genre,
        description: description || null,
        previewUrl: `/audio/${slug}/${previewFileName}`,
        fullMp3Path: fullMp3FilePath,
        fullWavPath,
        artworkUrl,
        mp3Price,
        wavPrice,
        unlimitedPrice,
        exclusivePrice,
        published: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/beats/${slug}`);

    return {
      success: true,
      message: `"${title}" was uploaded and saved successfully.`,
    };
  } catch (error) {
    console.error("Unable to publish beat:", error);

    return {
      success: false,
      message: "Unable to publish the beat. Check the terminal.",
    };
  }
}