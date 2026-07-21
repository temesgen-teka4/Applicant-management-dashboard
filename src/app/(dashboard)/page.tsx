"use client";

import { useState, Suspense } from "react";
import { StatCards } from "@/components/StatCards";
import { ApplicantFilters } from "@/components/ApplicantFilters";
import { ApplicantTable } from "@/components/ApplicantTable";
import { ApplicantDetailPanel } from "@/components/ApplicantDetailPanel";
import { useAuthStore } from "@/lib/stores/auth";
import { useResetSandbox } from "@/lib/hooks/useResetSandbox";

function DashboardContent() {
  // Demo-only toggles for the required loading/error states, wired to the
  // API's ?delay= and ?simulateError= params from the challenge spec.
  const [demoDelay, setDemoDelay] = useState(false);
  const [demoError, setDemoError] = useState(false);
  const markSessionExpired = useAuthStore((s) => s.markSessionExpired);
  const { mutate: reset, isPending: isResetting } = useResetSandbox();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-medium text-gray-900">Applicants</h1>

        {/* Demo controls — not part of the real admin workflow, just here to
            make the required states easy to show live. */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={demoDelay}
              onChange={(e) => setDemoDelay(e.target.checked)}
            />
            Simulate slow load
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={demoError}
              onChange={(e) => setDemoError(e.target.checked)}
            />
            Simulate error
          </label>
          <button
            onClick={markSessionExpired}
            className="rounded-lg border border-gray-300 px-2.5 py-1 transition hover:bg-gray-50"
          >
            Simulate expired session
          </button>
          <button
            onClick={() => reset()}
            disabled={isResetting}
            className="rounded-lg border border-gray-300 px-2.5 py-1 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {isResetting ? "Resetting…" : "Reset sandbox data"}
          </button>
        </div>
      </div>

      <StatCards />
      <ApplicantFilters />
      <ApplicantTable demoDelay={demoDelay ? 2000 : undefined} demoError={demoError} />
      <ApplicantDetailPanel />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}