"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { logout as apiLogout } from "@/lib/api/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Subscribe to the raw token (not a Date.now()-derived boolean) so render
  // stays pure. Presence of a token is enough to decide what to render;
  // actual time-based expiry is enforced below via a timer effect and, as a
  // backstop, by apiFetch's isTokenValid() check before every request.
  const token = useAuthStore((s) => s.token);
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const logout = useAuthStore((s) => s.logout);
  const markSessionExpired = useAuthStore((s) => s.markSessionExpired);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (expiresAt) {
      const msRemaining = expiresAt - Date.now();
      if (msRemaining <= 0) {
        markSessionExpired();
        return;
      }
      const timer = setTimeout(markSessionExpired, msRemaining);
      return () => clearTimeout(timer);
    }
  }, [token, expiresAt, router, markSessionExpired]);

  if (!token) {
    // Avoid flashing dashboard content while the redirect above kicks in.
    return null;
  }

  function handleLogout() {
    apiLogout();
    logout();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-sm font-medium text-gray-900">
            INFNOVA · Applicant dashboard
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}