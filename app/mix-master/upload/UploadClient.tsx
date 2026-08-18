"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import { upload } from "@vercel/blob/client";

interface UploadClientProps {
  initialOrderId?: string;
  initialEmail?: string;
}

interface UploadedBlob {
  url: string;
  pathname: string;
}

export default function UploadClient({
  initialOrderId = "",
  initialEmail = "",
}: UploadClientProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [orderId, setOrderId] =
    useState(initialOrderId);

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState(initialEmail);

  const [files, setFiles] =
    useState<File[]>([]);

  const [dragging, setDragging] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  function addFiles(
    incomingFiles: File[]
  ) {
    const allowedExtensions = [
      ".wav",
      ".mp3",
      ".aiff",
      ".aif",
      ".zip",
    ];

    const validFiles =
      incomingFiles.filter(
        (file) => {
          const lowerName =
            file.name.toLowerCase();

          return allowedExtensions.some(
            (extension) =>
              lowerName.endsWith(
                extension
              )
          );
        }
      );

    if (
      validFiles.length !==
      incomingFiles.length
    ) {
      setError(
        "Only WAV, MP3, AIFF, AIF, and ZIP files are allowed."
      );
    } else {
      setError("");
    }

    if (
      validFiles.length === 0
    ) {
      return;
    }

    setFiles((currentFiles) => {
      const combined = [
        ...currentFiles,
        ...validFiles,
      ];

      return combined.filter(
        (
          file,
          index,
          array
        ) =>
          array.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified ===
                file.lastModified
          ) === index
      );
    });

    setSuccess("");
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      Array.from(
        event.target.files ?? []
      );

    addFiles(selected);

    event.target.value = "";
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(true);
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const droppedFiles =
      Array.from(
        event.dataTransfer.files
      );

    addFiles(droppedFiles);
  }

  function removeFile(
    index: number
  ) {
    setFiles((currentFiles) =>
      currentFiles.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );

    setSuccess("");
    setError("");
  }

  function formatFileSize(
    bytes: number
  ) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  }

  const totalSize =
    files.reduce(
      (
        total,
        file
      ) =>
        total + file.size,
      0
    );

  async function saveUploadedFile(
    blob: UploadedBlob,
    file: File,
    parsedOrderId: number
  ) {
    const response =
      await fetch(
        "/api/mix-master-upload?action=complete",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            orderId:
              parsedOrderId,

            customerEmail:
              customerEmail.trim(),

            pathname:
              blob.pathname,

            blobUrl:
              blob.url,

            fileName:
              file.name,
          }),
        }
      );

    const data =
      (await response.json()) as {
        error?: string;
      };

    if (!response.ok) {
      throw new Error(
        data.error ??
          "The file uploaded, but it could not be connected to your order."
      );
    }
  }

  async function handleUpload() {
    setError("");
    setSuccess("");
    setProgress(0);

    const parsedOrderId =
      Number(orderId);

    if (
      !Number.isInteger(
        parsedOrderId
      ) ||
      parsedOrderId <= 0
    ) {
      setError(
        "Enter a valid Order ID."
      );

      return;
    }

    if (
      !customerEmail.trim()
    ) {
      setError(
        "Enter the email used at checkout."
      );

      return;
    }

    if (
      files.length === 0
    ) {
      setError(
        "Choose at least one project file."
      );

      return;
    }

    setUploading(true);

    try {
      let completed = 0;

      for (const file of files) {
        const pathname =
          `mix-master/${parsedOrderId}/${file.name}`;

        const blob =
          await upload(
            pathname,
            file,
            {
              access: "private",

              handleUploadUrl:
                "/api/mix-master-upload",

              clientPayload:
                JSON.stringify({
                  orderId:
                    parsedOrderId,

                  customerEmail:
                    customerEmail.trim(),
                }),

              multipart: true,
            }
          );

        await saveUploadedFile(
          {
            url: blob.url,
            pathname:
              blob.pathname,
          },
          file,
          parsedOrderId
        );

        completed += 1;

        setProgress(
          Math.round(
            (
              completed /
              files.length
            ) *
              100
          )
        );
      }

      setSuccess(
        files.length === 1
          ? "1 file uploaded successfully."
          : `${files.length} files uploaded successfully.`
      );
    } catch (
      uploadError
    ) {
      console.error(
        "Mix & Master upload failed:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload project files."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.35em] text-blue-500">
            NAYRBEATS
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Upload Your Files
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            Upload your Mix &
            Master stems, WAVs,
            references, or ZIP
            folder. Your files are
            stored privately and
            connected to your paid
            booking.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/5 bg-[#111111] p-7 md:p-9">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Order ID
              </label>

              <input
                type="number"
                value={orderId}
                onChange={(
                  event
                ) =>
                  setOrderId(
                    event.target
                      .value
                  )
                }
                placeholder="Example: 12"
                className="w-full rounded-2xl border border-white/5 bg-[#090909] px-4 py-4 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Checkout Email
              </label>

              <input
                type="email"
                value={
                  customerEmail
                }
                onChange={(
                  event
                ) =>
                  setCustomerEmail(
                    event.target
                      .value
                  )
                }
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/5 bg-[#090909] px-4 py-4 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div
            onClick={() =>
              fileInputRef.current?.click()
            }
            onDragOver={
              handleDragOver
            }
            onDragLeave={
              handleDragLeave
            }
            onDrop={handleDrop}
            className={`mt-8 cursor-pointer rounded-[24px] border border-dashed px-6 py-14 text-center transition ${
              dragging
                ? "border-blue-500 bg-blue-500/5"
                : "border-white/10 bg-[#0c0c0c] hover:border-blue-500/60"
            }`}
          >
            <input
              ref={
                fileInputRef
              }
              type="file"
              multiple
              accept=".wav,.mp3,.aiff,.aif,.zip,audio/mpeg,audio/wav,audio/aiff,application/zip"
              onChange={
                handleFileChange
              }
              className="hidden"
            />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/20 text-3xl text-blue-500">
              ↑
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Drag & Drop Your
              Files
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              or click here to
              browse your Mac
            </p>

            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-zinc-400">
              WAV • MP3 • AIFF •
              ZIP
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-bold">
                  Selected Files
                </h3>

                <span className="text-sm text-zinc-400">
                  {files.length}{" "}
                  {files.length === 1
                    ? "file"
                    : "files"}{" "}
                  •{" "}
                  {formatFileSize(
                    totalSize
                  )}
                </span>
              </div>

              <div className="space-y-3">
                {files.map(
                  (
                    file,
                    index
                  ) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0c0c0c] p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {
                            file.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatFileSize(
                            file.size
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          uploading
                        }
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          removeFile(
                            index
                          );
                        }}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
              {success}
            </div>
          )}

          {uploading && (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-zinc-400">
                <span>
                  Uploading
                  project...
                </span>

                <span>
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={
              uploading ||
              files.length === 0
            }
            onClick={
              handleUpload
            }
            className="mt-7 w-full rounded-full bg-blue-600 px-6 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900 disabled:text-zinc-500"
          >
            {uploading
              ? `Uploading... ${progress}%`
              : "Upload Project Files"}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-500">
            Files are uploaded
            to private NAYRBEATS
            storage. Your Order
            ID and checkout email
            must match a paid Mix
            & Master booking.
          </p>
        </div>
      </div>
    </main>
  );
}