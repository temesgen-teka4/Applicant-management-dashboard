import { useQuery } from "@tanstack/react-query";
import { getApplicants } from "@/lib/api/applicants";
import type { ApplicantListParams } from "@/types/applicant";

export function useApplicants(params: ApplicantListParams) {
  return useQuery({
    // Every param that affects the result set is in the key, so changing
    // any of them (search, filter, sort, page) triggers an automatic refetch.
    queryKey: ["applicants", params],
    queryFn: () => getApplicants(params),
    placeholderData: (previous) => previous, // avoid a full loading flash when paginating
  });
}