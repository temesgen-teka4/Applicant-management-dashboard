"use client";

import { useStats } from "@/lib/hooks/useStats";

export function StatCards() {
  const { data, isLoading, isError } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  // Stats are a nice-to-have on top of the table; if they fail, fail quietly
  // rather than blocking the whole dashboard.
  if (isError || !data) return null;

  const cards = [
    { label: "Total applicants", value: data.totalApplicants },
    ...Object.entries(data.byStatus ?? {}).map(([status, count]) => ({
      label: status,
      value: count,
    })),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <p className="text-xs capitalize text-gray-500">{card.label}</p>
          <p className="mt-1 text-xl font-medium text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}