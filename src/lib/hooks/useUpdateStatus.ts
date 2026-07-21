import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicantStatus } from "@/lib/api/applicants";
import type { ApplicantStatus } from "@/types/applicant";

/**
 * "Safe but fast": we don't hand-patch the cache optimistically. Instead we
 * wait for the server to confirm, then invalidate the list + stats + detail
 * queries so everything reflects the new status. Simpler to get right, and
 * the API is fast enough that it doesn't feel sluggish in the demo.
 */
export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicantStatus }) =>
      updateApplicantStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["applicant", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}