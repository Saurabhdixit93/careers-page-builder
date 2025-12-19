import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CompanyEditor } from "@/components/company-editor"

export default async function EditCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch company
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single()

  if (error || !company) {
    redirect("/dashboard")
  }

  // Fetch jobs for this company
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })

  return <CompanyEditor company={company} jobs={jobs || []} />
}
