import { apiFetch } from "./client";
import type { LoginResponse, User } from "@/types/applicant";

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getCurrentUser() {
  return apiFetch<User>("/auth/me");
}

export function logout() {
  // Best-effort server-side logout (204 No Content); the client-side store
  // clear happens regardless, in the calling code.
  return apiFetch<void>("/auth/logout", { method: "POST" }).catch(() => {});
}