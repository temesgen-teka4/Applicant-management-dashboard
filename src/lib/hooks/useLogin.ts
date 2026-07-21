//TanStack React Query Mutation Hook
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth";

export function useLogin() {
  const storeLogin = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      storeLogin(data.accessToken, data.expiresIn);
    },
  });
}