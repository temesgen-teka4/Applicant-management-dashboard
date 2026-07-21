import { useAuthStore } from "@/lib/stores/auth";

export const API_BASE_URL = "https://infnova-intern.vercel.app/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // whether to attach the bearer token, default true
}

/**
 * Every protected request in the app goes through this function.
 * Two things happen here and nowhere else:
 *  1. The bearer token is attached.
 *  2. A 401 response (or a locally-detected expired token) marks the
 *     session as expired in the auth store, so the UI can react in one place
 *     instead of every component checking for it individually.
 */
export async function apiFetch<T>(
  path: string,
  { body, auth = true, headers, ...rest }: RequestOptions = {}
): Promise<T> {
  const { token, isTokenValid, markSessionExpired } = useAuthStore.getState();

  if (auth && !isTokenValid()) {
    markSessionExpired();
    throw new ApiError(401, "Session expired");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
if (res.status === 401 && auth) {
    // Only requests that were supposed to carry a token get treated as a
    // session expiry. A 401 from an unauthenticated call (e.g. login with
    // wrong credentials) is a real, user-facing error — not an expired
    // session — so it falls through to the normal error handling below.
    markSessionExpired();
    throw new ApiError(401, "Session expired");
}

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {
      // response body wasn't JSON; keep the default message
    }
    throw new ApiError(res.status, message);
  }

  // Some endpoints (e.g. logout) may return no body.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}