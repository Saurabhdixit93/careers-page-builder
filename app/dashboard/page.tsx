import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch companies for this user
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching companies:", error)
  }

  // Fetch job counts for each company
  const companiesWithStats = await Promise.all(
    (companies || []).map(async (company) => {
      const { count: jobCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("company_id", company.id)

      const { count: activeJobCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("company_id", company.id)
        .eq("is_active", true)

      return {
        ...company,
        jobCount: jobCount || 0,
        activeJobCount: activeJobCount || 0,
      }
    }),
  )

  return <DashboardContent companies={companiesWithStats} user={user} />
}
