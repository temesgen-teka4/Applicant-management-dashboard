"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ApplicantListParams } from "@/types/applicant";

const DEFAULT_LIMIT = 10;

/**
 * Table state (search/filter/sort/page) lives in the URL, not in useState.
 * This makes it shareable, survives refresh, and works with the back
 * button — and it's what feeds the React Query key in useApplicants, so
 * any change here triggers an automatic refetch.
 */
export function useTableParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: ApplicantListParams = useMemo(
    () => ({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? DEFAULT_LIMIT),
      search: searchParams.get("search") ?? undefined,
      status: (searchParams.get("status") as ApplicantListParams["status"]) ?? "all",
      track: (searchParams.get("track") as ApplicantListParams["track"]) ?? "all",
      sortBy: (searchParams.get("sortBy") as ApplicantListParams["sortBy"]) ?? "applicationDate",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    }),
    [searchParams]
  );

  const setParams = useCallback(
    (updates: Partial<ApplicantListParams> & { resetPage?: boolean }) => {
      const next = new URLSearchParams(searchParams.toString());
      const { resetPage, ...rest } = updates;

      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "all") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      // Any filter/search/sort change should snap back to page 1.
      if (resetPage !== false) next.delete("page");

      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return { params, setParams };
}