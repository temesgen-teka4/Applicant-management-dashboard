import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/lib/api/applicants";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getDashboardSummary,
  });
}