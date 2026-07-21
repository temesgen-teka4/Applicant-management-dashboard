import { useQuery } from "@tanstack/react-query";
import { getApplicant } from "@/lib/api/applicants";

export function useApplicant(id: string | null) {
  return useQuery({
    queryKey: ["applicant", id],
    queryFn: () => getApplicant(id as string),
    enabled: Boolean(id), // only fetch once a row is actually selected
  });
}