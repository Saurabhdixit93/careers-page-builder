import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CareersPageContent } from "@/components/careers-page-content"

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch company (auth check ensures only owner can preview)
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single()

  if (error || !company) {
    redirect("/dashboard")
  }

  // Fetch all jobs including inactive ones for preview
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="bg-blue-50 border-b border-blue-200 py-3 text-center text-sm">
        <div className="container mx-auto px-4">
          <strong className="text-blue-900">Preview Mode:</strong>{" "}
          <span className="text-blue-700">
            This is how your careers page will look. Return to the editor to make changes.
          </span>
        </div>
      </div>
      <CareersPageContent company={company} jobs={jobs || []} />
    </div>
  )
}
