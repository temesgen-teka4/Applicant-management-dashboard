"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/lib/hooks/useLogin";
import { useAuthStore } from "@/lib/stores/auth";

export default function LoginPage() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const isTokenValid = useAuthStore((s) => s.isTokenValid);
  const isSessionExpired = useAuthStore((s) => s.isSessionExpired);

  const [email, setEmail] = useState("admin@infnova.tech");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isTokenValid()) router.replace("/");
  }, [isTokenValid, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { email, password },
      { onSuccess: () => router.replace("/") }
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-medium text-gray-900">
          Applicant dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in with your admin account.
        </p>

        {isSessionExpired && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your session expired. Please sign in again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : "Login failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}