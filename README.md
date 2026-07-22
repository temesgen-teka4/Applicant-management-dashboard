# INFNOVA Applicant Dashboard

An internship applicant management dashboard built for the INFNOVA Frontend Internship challenge. Lets an administrator log in, browse a searchable/filterable/sortable applicant list, view full applicant details, and update application status — all against a live REST API.

**Live app:** https://applicant-management-dashboard.netlify.app
**Repo:** https://github.com/temesgen-teka4/Applicant-management-dashboard

## Setup

​```bash
git clone https://github.com/temesgen-teka4/Applicant-management-dashboard.git
cd Applicant-management-dashboard
npm install
npm run dev
​```

Open `http://localhost:3000`. Sign in with:

- **Email:** `admin@infnova.tech`
- **Password:** `InternChallenge2026!`

## Tech stack

| Choice | Why |
|---|---|
| **Next.js (App Router) + TypeScript** | File-based routing gives a clean split between the public `/login` route and the protected dashboard route group, and matches the deploy target used by the challenge's own API. |
| **Tailwind CSS, hand-rolled components** | No UI library — kept the bundle lean and gave full control over every component, which also made it easy to match the loading/empty/error/expired states exactly to spec instead of fighting a library's defaults. |
| **TanStack Query (React Query)** | Handles loading/error state, caching, and automatic refetching out of the box. Table state (search/filter/sort/page) lives in the URL and feeds directly into the query key, so any change there triggers a refetch with no manual wiring. |
| **Zustand** | Small, centralized auth store (token, expiry, session-expired flag) that any component can read without prop drilling. |

## Architecture

The app is organized in layers, each with one job:

​```
UI (pages/components)
  → State (Zustand for auth, URL params for table state)
    → Data (React Query hooks)
      → API client (single fetch wrapper)
        → INFNOVA API
​```

**Key decisions:**

- **One API client, one place for auth.** Every request goes through `lib/api/client.ts`, which attaches the bearer token and is the *only* place that reacts to a 401. This meant fixing an early bug (a 401 on login being misread as a session expiry) took a one-line change in one file instead of touching every screen.
- **Table state lives in the URL**, not `useState`. Search, filters, sort, and page are all URL search params, which makes the table state shareable, refresh-safe, and back-button-friendly, and it's what drives the React Query cache key.
- **Session expiry has three layers of defense:** a timer set to the token's exact expiry, a check before every protected request, and a global 401 handler — so however the session ends, the user lands on the same clear "session expired" state rather than a silent failure.
- **Status updates are "safe but fast":** rather than optimistically patching the cache, the app waits for the server to confirm a status/notes change, then invalidates the relevant queries. Simpler to get right, and the API is fast enough that it doesn't feel sluggish.
- **The applicant detail view is a side panel** (not a separate page) synced to a `?applicantId=` URL param — no jarring navigation away from the table, but still a real, shareable, bookmarkable, back-button-friendly URL state.

## Demo controls

The dashboard includes a small row of demo-only controls (separate from the real admin workflow) to make the required states easy to show live during a walkthrough:

- **Simulate slow load** — wires the API's `?delay=` param to show the loading state
- **Simulate error** — wires `?simulateError=true` to show the error state
- **Simulate expired session** — manually triggers the session-expired flow without waiting an hour
- **Reset sandbox data** — calls `/session/reset` to discard status/notes changes made during testing

## Assumptions

- The `PaginatedApplicants` response's `meta` object (`page`, `limit`, `total`, `totalPages`) is authoritative for pagination controls, rather than deriving page count client-side.
- Reference data (`/tracks`, `/application-statuses`) is treated as effectively static for a session (`staleTime: Infinity`) since it's unlikely to change between page loads.
- A missing/null `notes` field is treated the same as an empty string in the UI, and an empty save is sent as `null` rather than `""`.

## What I'd improve with more time

- Optimistic UI updates for status changes (instant badge change with rollback on failure) rather than waiting for server confirmation
- Filters for `country` and `experienceLevel` in addition to status/track, since the API supports both
- Unit tests around the API client's auth/401 handling, given that's exactly where the one real bug during development showed up
- A proper toast/notification system for save confirmations instead of inline "Saving…" text
- Debounced/cached reference-data fetches shared across the filter bar and detail panel, to avoid a duplicate request if both mount at once