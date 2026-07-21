import { apiFetch } from "./client";
import type {
  Applicant,
  ApplicantListParams,
  ApplicantStatus,
  ApplicantSummary,
  DashboardSummary,
  PaginatedApplicants,
  ReferenceList,
} from "@/types/applicant";

function buildQuery(params: ApplicantListParams): string {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.search) search.set("search", params.search);
  if (params.status && params.status !== "all")
    search.set("status", params.status);
  if (params.track && params.track !== "all") search.set("track", params.track);
  if (params.country) search.set("country", params.country);
  if (params.experienceLevel && params.experienceLevel !== "all")
    search.set("experienceLevel", params.experienceLevel);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  // demo-only params from the challenge spec
  if (params.delay) search.set("delay", String(Math.min(params.delay, 5000)));
  if (params.simulateError) search.set("simulateError", "true");
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function getApplicants(params: ApplicantListParams = {}) {
  return apiFetch<PaginatedApplicants>(`/applicants${buildQuery(params)}`);
}

export function getApplicant(id: string) {
  return apiFetch<Applicant>(`/applicants/${id}`);
}

export function updateApplicantStatus(id: string, status: ApplicantStatus) {
  return apiFetch<ApplicantSummary>(`/applicants/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function updateApplicantNotes(id: string, notes: string | null) {
  return apiFetch<{ id: string; notes: string | null; updatedAt: string }>(
    `/applicants/${id}/notes`,
    { method: "PATCH", body: { notes } }
  );
}

export function getDashboardSummary() {
  return apiFetch<DashboardSummary>(`/dashboard/summary`);
}

export function resetSandbox() {
  return apiFetch<void>(`/session/reset`, { method: "POST" });
}

// Reference data — { data: [{ value, label }] } for each of these.
export function getApplicationStatuses() {
  return apiFetch<ReferenceList>(`/application-statuses`);
}

export function getTracks() {
  return apiFetch<ReferenceList>(`/tracks`);
}

export function getCountries() {
  return apiFetch<ReferenceList>(`/countries`);
}

export function getExperienceLevels() {
  return apiFetch<ReferenceList>(`/experience-levels`);
}