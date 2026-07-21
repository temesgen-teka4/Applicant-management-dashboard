"use client";

import { useState, useEffect } from "react";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { useApplicationStatuses } from "@/lib/hooks/useApplicationStatuses";
import { useTracks } from "@/lib/hooks/useTracks";
import type { ApplicantStatus, ApplicantTrack } from "@/types/applicant";

const SORT_OPTIONS = [
  { value: "applicationDate", label: "Date applied" },
  { value: "fullName", label: "Name" },
  { value: "email", label: "Email" },
  { value: "status", label: "Status" },
  { value: "track", label: "Track" },
];

export function ApplicantFilters() {
  const { params, setParams } = useTableParams();
  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const { data: statuses } = useApplicationStatuses();
  const { data: tracks } = useTracks();

  // Debounce free-text search so we're not refetching on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== (params.search ?? "")) {
        setParams({ search: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="text"
        placeholder="Search by name or email…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:max-w-xs"
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={params.status}
          onChange={(e) =>
            setParams({ status: e.target.value as ApplicantStatus | "all" })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          <option value="all">All statuses</option>
          {(statuses ?? []).map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={params.track}
          onChange={(e) =>
            setParams({ track: e.target.value as ApplicantTrack | "all" })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          <option value="all">All tracks</option>
          {(tracks ?? []).map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={params.sortBy}
          onChange={(e) =>
            setParams({
              sortBy: e.target.value as
                | "fullName"
                | "email"
                | "applicationDate"
                | "status"
                | "track",
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setParams({
              sortOrder: params.sortOrder === "asc" ? "desc" : "asc",
              resetPage: false,
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          aria-label="Toggle sort order"
        >
          {params.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>
    </div>
  );
}