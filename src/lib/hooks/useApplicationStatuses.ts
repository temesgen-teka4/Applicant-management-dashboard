import { useQuery } from "@tanstack/react-query";
import { getApplicationStatuses } from "@/lib/api/applicants";

export function useApplicationStatuses() {
  return useQuery({
    queryKey: ["reference", "application-statuses"],
    queryFn: getApplicationStatuses,
    staleTime: Infinity, // reference data, effectively static for the session
    select: (res) => res.data, // ReferenceItem[]
  });
}