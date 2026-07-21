import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  expiresAt: number | null; // epoch ms
  isSessionExpired: boolean;
  login: (token: string, expiresInSeconds?: number) => void;
  logout: () => void;
  markSessionExpired: () => void;
  isTokenValid: () => boolean;
}

const DEFAULT_TTL_SECONDS = 60 * 60; // 1 hour, per challenge spec

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,
      isSessionExpired: false,

      login: (token, expiresInSeconds = DEFAULT_TTL_SECONDS) =>
        set({
          token,
          expiresAt: Date.now() + expiresInSeconds * 1000,
          isSessionExpired: false,
        }),

      logout: () =>
        set({ token: null, expiresAt: null, isSessionExpired: false }),

      markSessionExpired: () =>
        set({ token: null, expiresAt: null, isSessionExpired: true }),

      isTokenValid: () => {
        const { token, expiresAt } = get();
        return Boolean(token && expiresAt && Date.now() < expiresAt);
      },
    }),
    {
      name: "infnova-auth",
      // Only persist what's needed to survive a refresh; nothing sensitive beyond the token itself.
      partialize: (state) => ({
        token: state.token,
        expiresAt: state.expiresAt,
      }),
    }
  )
);