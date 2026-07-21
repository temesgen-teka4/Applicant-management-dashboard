"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { useApplicants } from "@/lib/hooks/useApplicants";
import { StatusBadge } from "./StatusBadge";
import { LoadingState, EmptyState, ErrorState } from "./states/QueryStates";
import { ApiError } from "@/lib/api/client";

export function ApplicantTable({
  demoDelay,
  demoError,
}: {
  demoDelay?: number;
  demoError?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { params, setParams } = useTableParams();

  const { data, isLoading, isError, error, refetch, isFetching } =
    useApplicants({ ...params, delay: demoDelay, simulateError: demoError });

  function openApplicant(id: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("applicantId", id);
    router.push(`${pathname}?${next.toString()}`);
  }

  if (isLoading) return <LoadingState label="Loading applicants…" />;

  if (isError) {
    const message =
      error instanceof ApiError && error.status === 401
        ? undefined // the layout's guard will redirect to /login on its own
        : "Couldn't load applicants. Please try again.";
    return message ? (
      <ErrorState message={message} onRetry={() => refetch()} />
    ) : null;
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        title="No applicants found"
        description={
          params.search || params.status !== "all" || params.track !== "all"
            ? "Try clearing your search or filters."
            : "No one has applied yet."
        }
      />
    );
  }

  const { meta } = data;

  return (
    <div className={isFetching ? "opacity-60 transition" : "transition"}>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-170 text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Track</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.data.map((applicant) => (
              <tr
                key={applicant.id}
                onClick={() => openApplicant(applicant.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {applicant.fullName}
                </td>
                <td className="px-4 py-3 text-gray-600">{applicant.email}</td>
                <td className="px-4 py-3 text-gray-600">{applicant.country}</td>
                <td className="px-4 py-3 capitalize text-gray-600">
                  {applicant.track}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={applicant.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(applicant.applicationDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Page {meta.page} of {meta.totalPages} · {meta.total} total
        </span>
        <div className="flex gap-2">
          <button
            disabled={meta.page <= 1}
            onClick={() => setParams({ page: meta.page - 1, resetPage: false })}
            className="rounded-lg border border-gray-300 px-3 py-1.5 transition hover:bg-gray-50 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => setParams({ page: meta.page + 1, resetPage: false })}
            className="rounded-lg border border-gray-300 px-3 py-1.5 transition hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}