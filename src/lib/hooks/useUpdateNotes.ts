import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicantNotes } from "@/lib/api/applicants";

export function useUpdateNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string | null }) =>
      updateApplicantNotes(id, notes),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applicant", variables.id] });
    },
  });
}