import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { CareersPageContent } from "@/components/careers-page-content";
import type { Company, Job } from "@/lib/types";

interface DemoCareersPageProps {
  params: Promise<{ slug: string }>;
}

const getDemoCompany = (slug: string): Company => ({
  id: "demo-company-id",
  user_id: "demo-user-id",
  name:
    slug === "techcorp"
      ? "TechCorp Inc."
      : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
  slug: slug,
  tagline: "Building the future of technology, one innovation at a time",
  description:
    "We are a leading technology company focused on creating innovative solutions that transform industries. Our mission is to empower businesses and individuals through cutting-edge technology.",
  logo_url: undefined,
  banner_url: undefined,
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  culture_video_url: undefined,
  is_published: true,
  content_sections: [
    {
      id: "about",
      type: "about",
      title: "About Us",
      content:
        "TechCorp is a global leader in technology innovation. Founded in 2015, we've grown from a small startup to a company of over 500 employees across 10 countries. Our commitment to excellence drives everything we do.",
      order: 0,
    },
    {
      id: "culture",
      type: "culture",
      title: "Our Culture",
      content:
        "We believe in fostering a culture of innovation, collaboration, and continuous learning. Our team members are encouraged to think outside the box, take calculated risks, and push the boundaries of what's possible.",
      order: 1,
    },
    {
      id: "benefits",
      type: "benefits",
      title: "Benefits & Perks",
      content:
        "Competitive salary, equity packages, unlimited PTO, remote-first culture, health insurance, learning budget, home office stipend, and annual team retreats to amazing destinations.",
      order: 2,
    },
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const getDemoJobs = (companyId: string): Job[] => [
  {
    id: "demo-job-1",
    company_id: companyId,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    location_type: "hybrid",
    job_type: "full-time",
    salary_min: 150000,
    salary_max: 200000,
    salary_currency: "USD",
    description:
      "We're looking for a Senior Frontend Engineer to join our growing team. You'll work on building beautiful, performant user interfaces for our flagship products.",
    responsibilities: [
      "Lead frontend architecture decisions",
      "Mentor junior developers",
      "Build reusable component libraries",
      "Collaborate with design and product teams",
    ],
    qualifications: [
      "5+ years of frontend experience",
      "Expert in React and TypeScript",
      "Experience with modern CSS and animation libraries",
      "Strong communication skills",
    ],
    benefits: [
      "Competitive salary",
      "Equity package",
      "Health insurance",
      "Unlimited PTO",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-job-2",
    company_id: companyId,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    location_type: "remote",
    job_type: "full-time",
    salary_min: 120000,
    salary_max: 160000,
    salary_currency: "USD",
    description:
      "Join our design team to create stunning user experiences. You'll work closely with product and engineering to shape the future of our products.",
    responsibilities: [
      "Create user-centered designs",
      "Build and maintain design systems",
      "Conduct user research",
      "Prototype new features",
    ],
    qualifications: [
      "4+ years of product design experience",
      "Proficiency in Figma",
      "Strong portfolio",
      "Experience with design systems",
    ],
    benefits: [
      "Remote-first",
      "Learning budget",
      "Home office stipend",
      "Team retreats",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-job-3",
    company_id: companyId,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Austin, TX",
    location_type: "onsite",
    job_type: "full-time",
    salary_min: 140000,
    salary_max: 180000,
    salary_currency: "USD",
    description:
      "We need a talented Backend Engineer to help scale our infrastructure and build robust APIs that power our applications.",
    responsibilities: [
      "Design and implement APIs",
      "Optimize database performance",
      "Build scalable microservices",
      "Ensure system reliability",
    ],
    qualifications: [
      "4+ years backend experience",
      "Strong in Node.js or Python",
      "Database expertise",
      "Cloud infrastructure knowledge",
    ],
    benefits: [
      "Competitive comp",
      "401k matching",
      "Parental leave",
      "Wellness programs",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-job-4",
    company_id: companyId,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    location_type: "remote",
    job_type: "full-time",
    salary_min: 130000,
    salary_max: 170000,
    salary_currency: "USD",
    description:
      "Help us build and maintain our cloud infrastructure. You'll work on CI/CD pipelines, monitoring, and ensuring our systems are always running smoothly.",
    responsibilities: [
      "Manage cloud infrastructure",
      "Build CI/CD pipelines",
      "Implement monitoring solutions",
      "Automate deployments",
    ],
    qualifications: [
      "3+ years DevOps experience",
      "AWS/GCP expertise",
      "Kubernetes knowledge",
      "Scripting skills",
    ],
    benefits: [
      "Fully remote",
      "Flexible hours",
      "Equipment budget",
      "Conference allowance",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-job-5",
    company_id: companyId,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Los Angeles, CA",
    location_type: "hybrid",
    job_type: "full-time",
    salary_min: 100000,
    salary_max: 140000,
    salary_currency: "USD",
    description:
      "Lead our marketing efforts and help us reach new audiences. You'll develop campaigns, manage our brand presence, and drive growth.",
    responsibilities: [
      "Develop marketing strategies",
      "Manage campaigns",
      "Analyze metrics",
      "Lead marketing team",
    ],
    qualifications: [
      "5+ years marketing experience",
      "B2B SaaS background",
      "Data-driven approach",
      "Leadership skills",
    ],
    benefits: [
      "Growth opportunities",
      "Marketing budget",
      "Team events",
      "Career development",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function generateMetadata({
  params,
}: DemoCareersPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("name, tagline")
    .eq("slug", slug)
    .maybeSingle();

  const demoCompany = company || getDemoCompany(slug);

  return {
    title: `Demo: Careers at ${demoCompany.name}`,
    description:
      demoCompany.tagline || `Demo careers page for ${demoCompany.name}`,
  };
}

export default async function DemoCareersPage({
  params,
}: DemoCareersPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  // Use demo data if no company exists
  const displayCompany = company || getDemoCompany(slug);

  let jobs: Job[] = [];

  if (company) {
    // Fetch real jobs if company exists
    const { data: realJobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });
    jobs = realJobs || [];
  } else {
    // Use demo jobs
    jobs = getDemoJobs(displayCompany.id);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-b border-border py-3 text-center text-sm">
        <span className="text-muted-foreground">
          <strong className="text-foreground">Demo Mode</strong> — This is a
          preview with sample data.{" "}
          <a
            href="/auth/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </a>{" "}
          to create your own careers page.
        </span>
      </div>
      <CareersPageContent company={displayCompany} jobs={jobs} />
    </div>
  );
}
