import { useQuery } from "@tanstack/react-query";
import { getTracks } from "@/lib/api/applicants";

export function useTracks() {
  return useQuery({
    queryKey: ["reference", "tracks"],
    queryFn: getTracks,
    staleTime: Infinity,
    select: (res) => res.data,
  });
}