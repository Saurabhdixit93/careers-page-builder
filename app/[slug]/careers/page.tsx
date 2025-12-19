import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CareersPageContent } from "@/components/careers-page-content"

interface CareersPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: company } = await supabase
    .from("companies")
    .select("name, tagline, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!company) {
    return {
      title: "Careers Page Not Found",
    }
  }

  return {
    title: `Careers at ${company.name}`,
    description: company.tagline || company.description || `Join the team at ${company.name}`,
    openGraph: {
      title: `Careers at ${company.name}`,
      description: company.tagline || company.description || `Join the team at ${company.name}`,
      type: "website",
    },
  }
}

export default async function CareersPage({ params, searchParams }: CareersPageProps) {
  const { slug } = await params
  const filters = await searchParams
  const supabase = await createClient()

  // Fetch company data
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (companyError || !company) {
    notFound()
  }

  // Fetch active jobs for this company
  let jobsQuery = supabase
    .from("jobs")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Apply filters
  if (filters.location && typeof filters.location === "string") {
    jobsQuery = jobsQuery.ilike("location", `%${filters.location}%`)
  }

  if (filters.job_type && typeof filters.job_type === "string") {
    jobsQuery = jobsQuery.eq("job_type", filters.job_type)
  }

  if (filters.search && typeof filters.search === "string") {
    jobsQuery = jobsQuery.ilike("title", `%${filters.search}%`)
  }

  const { data: jobs } = await jobsQuery

  return <CareersPageContent company={company} jobs={jobs || []} />
}
