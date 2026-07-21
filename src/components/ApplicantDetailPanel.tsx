"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useApplicant } from "@/lib/hooks/useApplicant";
import { useUpdateStatus } from "@/lib/hooks/useUpdateStatus";
import { useUpdateNotes } from "@/lib/hooks/useUpdateNotes";
import { useApplicationStatuses } from "@/lib/hooks/useApplicationStatuses";
import { StatusBadge } from "./StatusBadge";
import { LoadingState, ErrorState } from "./states/QueryStates";
import type { ApplicantStatus } from "@/types/applicant";

const NOTES_MAX_LENGTH = 1000;

function NotesEditor({
  applicantId,
  initialNotes,
}: {
  applicantId: string;
  initialNotes: string;
}) {
  const [value, setValue] = useState(initialNotes);
  const { mutate, isPending } = useUpdateNotes();

  function save() {
    if (value === initialNotes) return; // no-op if unchanged
    mutate({ id: applicantId, notes: value.trim() === "" ? null : value });
  }

  return (
    <div>
      <label className="text-sm text-gray-500" htmlFor="notes-field">
        Notes
      </label>
      <textarea
        id="notes-field"
        value={value}
        maxLength={NOTES_MAX_LENGTH}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        rows={3}
        placeholder="Add internal notes about this applicant…"
        className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{isPending ? "Saving…" : "Saves when you click away"}</span>
        <span>
          {value.length}/{NOTES_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}

function LinkRow({ label, url }: { label: string; url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-900"
    >
      {label}
    </a>
  );
}

export function ApplicantDetailPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const applicantId = searchParams.get("applicantId");

  const { data, isLoading, isError, refetch } = useApplicant(applicantId as string);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStatus();
  const { data: statusOptions } = useApplicationStatuses();

  if (!applicantId) return null;

  function close() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("applicantId");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        aria-label="Close panel"
        onClick={close}
        className="absolute inset-0 bg-black/30"
      />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-medium text-gray-900">
            Applicant details
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 px-5 py-4">
          {isLoading && <LoadingState label="Loading applicant…" />}

          {isError && (
            <ErrorState
              message="Couldn't load this applicant."
              onRetry={() => refetch()}
            />
          )}

          {data && (
            <div className="space-y-5">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {data.fullName}
                </p>
                <p className="text-sm text-gray-500">{data.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Track</p>
                  <p className="capitalize text-gray-900">{data.track}</p>
                </div>
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="capitalize text-gray-900">
                    {data.experienceLevel}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Country</p>
                  <p className="text-gray-900">{data.country}</p>
                </div>
                <div>
                  <p className="text-gray-500">Applied</p>
                  <p className="text-gray-900">
                    {new Date(data.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                {data.phoneNumber && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="text-gray-900">{data.phoneNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Status</p>
                  <StatusBadge status={data.status} />
                </div>
              </div>

              {data.skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {data.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(data.portfolioUrl || data.githubUrl || data.linkedInUrl) && (
                <div className="flex flex-wrap gap-3">
                  <LinkRow label="Portfolio" url={data.portfolioUrl} />
                  <LinkRow label="GitHub" url={data.githubUrl} />
                  <LinkRow label="LinkedIn" url={data.linkedInUrl} />
                </div>
              )}

              {data.motivation && (
                <div>
                  <p className="text-sm text-gray-500">Motivation</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {data.motivation}
                  </p>
                </div>
              )}

              <NotesEditor applicantId={data.id} initialNotes={data.notes ?? ""} />

              <div>
                <label className="text-sm text-gray-500" htmlFor="status-select">
                  Update status
                </label>
                <select
                  id="status-select"
                  value={data.status}
                  disabled={isUpdating}
                  onChange={(e) =>
                    updateStatus({
                      id: data.id,
                      status: e.target.value as ApplicantStatus,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
                >
                  {(statusOptions ?? []).map((s: { value: string; label: string }) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {isUpdating && (
                  <p className="mt-1 text-xs text-gray-500">Saving…</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}