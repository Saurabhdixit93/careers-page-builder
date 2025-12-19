# Technical Specification: Careers Page Builder

This document outlines the technical architecture, data models, assumptions, and testing strategy for the Careers Page Builder platform.

## 1. Assumptions

The development and deployment of this system are based on the following technical assumptions:

- **Framework**: Next.js 16 (App Router) is used for its robust SSR/ISR capabilities and React Server Components.
- **Backend-as-a-Service**: Supabase provides the core infrastructure, including PostgreSQL database, Authentication, and Row Level Security (RLS).
- **Styling**: Tailwind CSS 4 is adopted for a utility-first approach with modern CSS features.
- **Multi-tenancy**: Isolation is achieved at the database level using RLS and logically via unique URL slugs (`/[company-slug]/careers`).
- **Environment**: The application is designed to be deployed on Vercel, leveraging its native support for Next.js features and Edge functions.
- **Data Persistence**: All branding configuration and job data are stored as relational data in PostgreSQL, with content sections and list-based job fields (responsibilities, etc.) stored as JSONB for maximum flexibility and ease of management.

---

## 2. Architecture

The system follows a modern full-stack architecture with a focus on PERFORMANCE and SECURITY.

### 2.1 Component Structure
- **Server Components**: Used for data fetching (fetching company info, job lists) to minimize client-side bundle size and improve SEO.
- **Client Components**: Used for interactive elements like the Branding Editor, Job Filters, and Form submissions (React Hook Form + Zod).
- **Shared UI**: Based on Shadcn UI (Radix UI primitives), ensuring accessibility and consistent design.

### 2.2 Data Flow
1. **Recruiter Flow**: Auth -> Dashboard -> Supabase Client (RLS protected) -> DB Updates.
2. **Candidate Flow**: Public URL -> Next.js Server Component -> Supabase (Public Read Access) -> Rendered Page (SEO Optimized).

### 2.3 Security (RLS)
Security is implemented using Supabase Row Level Security:
- **Profiles**: Restricted to `auth.uid() = id`.
- **Companies**: Ownership verified via `user_id`. Only owners can update branding.
- **Jobs**: Publicly readable if `is_published` is true and `company.is_published` is true.

---

## 3. Database Schema

### 3.1 `profiles`
Extends the standard library of users.
- `id` (uuid, PK): Matches `auth.users.id`.
- `full_name` (text): Recruiter's name.
- `company_name` (text): Primary company name.

### 3.2 `companies`
Central entity for branding and multi-tenancy.
- `id` (uuid, PK)
- `user_id` (uuid, FK): Reference to `profiles.id`.
- `slug` (text, Unique): Used for public URLs.
- `name` (text): Display name.
- `tagline` (text)
- `logo_url` / `banner_url` (text)
- `primary_color` / `secondary_color` (text): HEX/HSL codes for branding.
- `content_sections` (jsonb): Array of `{ type, title, content, order }`.
- `is_published` (boolean): Global visibility toggle.

### 3.3 `jobs`
Job postings linked to a recruiter's company.
- `id` (uuid, PK)
- `company_id` (uuid, FK): Reference to `companies.id`.
- `title` (text)
- `location` (text)
- `job_type` (text): Full-time, Part-time, Contract, etc.
- `is_active` (boolean): Visibility toggle for specific jobs.
- `salary_min` / `salary_max` (numeric)
- `salary_currency` (text): Default 'USD'.
- `application_url` (text): Optional external application link.
- `responsibilities` (jsonb): Dynamic array of strings.
- `qualifications` (jsonb): Dynamic array of strings.
- `benefits` (jsonb): Dynamic array of strings.

---

## 4. Test Plan

### 4.1 Manual Verification
- **Branding Sync**: Verify that changing a color in the dashboard immediately updates the "Preview" and public page.
- **Auth Guard**: Ensure `/dashboard` routes redirect to `/auth/sign-in` if not authenticated.
- **Responsive Audit**: Test the Careers Page on Mobile, Tablet, and Desktop breakpoints.

### 4.2 Automated Testing Strategy
- **Unit Tests**: Focus on utility functions (`lib/utils.ts`) and Zod validation logic.
- **Integration Tests**: Verify Supabase RLS policies by attempting to edit data from a non-owner account.
- **Smoke Tests**: Use Playwright or Cypress to verify the "Happy Path" (Sign up -> Create Company -> Post Job -> View Public Page).

### 4.3 Performance & SEO
- **Lighthouse Audit**: Aim for 90+ in Performance and SEO for public-facing pages.
- **Metadata Verification**: Ensure dynamic metadata (Title, Description, OpenGraph tags) are correctly generated per company slug.
