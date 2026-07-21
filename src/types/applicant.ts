export type ApplicantStatus = "pending" | "shortlisted" | "accepted" | "rejected";

export type ApplicantTrack =
  | "frontend"
  | "backend"
  | "ui-ux"
  | "data-analytics"
  | "mobile";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // seconds
  user: User;
}

// What the list endpoint returns per row
// From the screen when the Admin open the first page or summery of the applicants 
export interface ApplicantSummary {
  id: string;
  fullName: string;
  email: string;
  country: string;
  track: ApplicantTrack;
  status: ApplicantStatus;
  applicationDate: string;
}

// What GET /applicants/{id} returns — a superset of the summary
// When the Admin try to see the full details about the Applicants he can see these:
export interface Applicant extends ApplicantSummary {
  phoneNumber?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedInUrl: string | null;
  motivation: string | null;
  notes: string | null;
  updatedAt: string;
}

export interface PaginatedApplicants {
  data: ApplicantSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totalApplicants: number;
  byStatus: Record<string, number>;
  byTrack: Record<string, number>;
}

export interface ReferenceItem {
  value: string;
  label: string;
}

export interface ReferenceList {
  data: ReferenceItem[];
}

export interface ApplicantListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicantStatus | "all";
  track?: ApplicantTrack | "all";
  country?: string;
  experienceLevel?: ExperienceLevel | "all";
  sortBy?: "fullName" | "email" | "applicationDate" | "status" | "track";
  sortOrder?: "asc" | "desc";
  // demo-only, per challenge spec
  delay?: number;
  simulateError?: boolean;
}