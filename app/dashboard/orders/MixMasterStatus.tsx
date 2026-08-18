"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

interface MixMasterStatusProps {
  orderId: number;
  currentStatus: string;
}

const statuses = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "ready",
    label: "Ready",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export default function MixMasterStatus({
  orderId,
  currentStatus,
}: MixMasterStatusProps) {
  const router = useRouter();

  const [
    status,
    setStatus,
  ] = useState(
    currentStatus
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();

  async function updateStatus(
    newStatus: string
  ) {
    setError("");

    const previousStatus =
      status;

    setStatus(
      newStatus
    );

    try {
      const response =
        await fetch(
          "/api/mix-master-status",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId,
                status:
                  newStatus,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to update status."
        );
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setStatus(
        previousStatus
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update status."
      );
    }
  }

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500">
        Project Status
      </p>

      <select
        value={status}
        disabled={isPending}
        onChange={(
          event
        ) =>
          updateStatus(
            event.target
              .value
          )
        }
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-black text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
      >
        {statuses.map(
          (item) => (
            <option
              key={
                item.value
              }
              value={
                item.value
              }
            >
              {
                item.label
              }
            </option>
          )
        )}
      </select>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}