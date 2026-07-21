import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetSandbox } from "@/lib/api/applicants";

export function useResetSandbox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetSandbox,
    onSuccess: () => {
      // Everything applicant-related could have changed after a reset.
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["applicant"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}