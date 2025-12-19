export interface Company {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  culture_video_url?: string;
  primary_color: string;
  secondary_color: string;
  content_sections: ContentSection[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  type: "about" | "culture" | "benefits" | "values" | "team" | "custom";
  title: string;
  content: string;
  order: number;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  department?: string;
  location: string;
  job_type: string;
  experience_level?: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  application_url?: string;
  location_type?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyAnalytics {
  id: string;
  company_id: string;
  page_views: number;
  unique_visitors: number;
  job_views: Record<string, number>;
  application_clicks: number;
  date: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_email: string;
  candidate_name: string;
  candidate_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "accepted";
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "admin" | "editor" | "viewer";
  created_at: string;
}

export interface JobTemplate {
  id: string;
  user_id: string;
  name: string;
  department?: string;
  job_type: string;
  experience_level?: string;
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  created_at: string;
}
