import type { ApplicantStatus } from "@/types/applicant";

const STYLES: Record<ApplicantStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  shortlisted: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: ApplicantStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STYLES[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}