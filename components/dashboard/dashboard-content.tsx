"use client";

import { useMemo } from "react";
import type { Company } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Settings,
  Eye,
  BarChart3,
  Building2,
  ChevronRight,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, cardHover } from "@/lib/animations";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

// --- Types ---

interface CompanyWithStats extends Company {
  jobCount: number;
  activeJobCount: number;
}

interface DashboardContentProps {
  companies: CompanyWithStats[];
  user: User;
}

// --- Sub-components ---

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "primary" 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  variant?: "primary" | "success" | "warning" | "chart";
}) => {
  const styles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    chart: "bg-chart-1/10 text-chart-1",
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const CompanyCard = ({ company, index }: { company: CompanyWithStats; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover="hover"
  >
    <motion.div variants={cardHover}>
      <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-semibold"
                  style={{ backgroundColor: company.primary_color }}
                >
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{company.name}</CardTitle>
                <CardDescription className="text-xs">
                  /{company.slug}/careers
                </CardDescription>
              </div>
            </div>
            {company.is_published ? (
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                Live
              </span>
            ) : (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Draft
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {company.tagline || "No tagline set"}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {company.activeJobCount} active jobs
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1 gap-2">
              <Link href={`/dashboard/${company.slug}/edit`}>
                <Settings className="h-4 w-4" />
                Manage
              </Link>
            </Button>
            {company.is_published && (
              <Button asChild variant="outline" size="icon" className="bg-transparent">
                <Link href={`/${company.slug}/careers`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
);

const AddPageCard = ({ delayIndex }: { delayIndex: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delayIndex * 0.05 }}
  >
    <Card className="group flex h-full min-h-[240px] flex-col items-center justify-center border-dashed border-border/50 bg-transparent p-6 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
      <Link 
        href="/dashboard/create-company"
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary">
          <Plus className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold transition-colors group-hover:text-primary">
            Add Another Page
          </p>
          <p className="text-xs text-muted-foreground">
            Create a new branded careers page
          </p>
        </div>
      </Link>
    </Card>
  </motion.div>
);

const QuickActionLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <Link
    href={href}
    className="group flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card"
  >
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
  </Link>
);



export function DashboardContent({ companies, user }: DashboardContentProps) {
  const stats = useMemo(() => {
    const totalJobs = companies.reduce((acc, c) => acc + c.jobCount, 0);
    const totalActiveJobs = companies.reduce((acc, c) => acc + c.activeJobCount, 0);
    const publishedPages = companies.filter((c) => c.is_published).length;
    const hasCompany = companies.length > 0;

    return { totalJobs, totalActiveJobs, publishedPages, hasCompany };
  }, [companies]);

  const userName = user.user_metadata?.full_name?.split(" ")[0] || "";

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 gradient-mesh opacity-30" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-12 rounded-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight">Whitecarrot</h1>
              <h3 className="text-sm text-muted-foreground font-semibold">Build your future</h3>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit" className="cursor-pointer">Sign out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
          
          {/* Welcome Header */}
          <motion.section variants={fadeInUp} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back{userName ? `, ${userName}` : ""}
              </h1>
              <p className="mt-1 text-muted-foreground">Manage your careers pages and job postings</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/dashboard/create-company">
                <Plus className="h-4 w-4" /> Create Careers Page
              </Link>
            </Button>
          </motion.section>

          {/* Stats Overview */}
          {stats.hasCompany && (
            <motion.section variants={fadeInUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard title="Total Pages" value={companies.length} icon={Building2} />
              <StatsCard title="Published" value={stats.publishedPages} icon={Eye} variant="success" />
              <StatsCard title="Total Jobs" value={stats.totalJobs} icon={Briefcase} variant="warning" />
              <StatsCard title="Active Jobs" value={stats.totalActiveJobs} icon={BarChart3} variant="chart" />
            </motion.section>
          )}

          {/* Main Content: Careers Pages Grid */}
          <motion.section variants={fadeInUp}>
            <h2 className="mb-4 text-xl font-semibold">Your Careers Pages</h2>

            {!stats.hasCompany ? (
              <Card className="pt-0 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">Get Started</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Create your first careers page to start attracting top talent.
                  </p>
                  <Button asChild className="mt-6 gap-2">
                    <Link href="/dashboard/create-company">
                      <Plus className="h-4 w-4" /> Create Your First Page
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company, index) => (
                  <CompanyCard key={company.id} company={company} index={index} />
                ))}
                <AddPageCard delayIndex={companies.length} />
              </div>
            )}
          </motion.section>

          {/* Secondary Content: Quick Actions */}
          {stats.hasCompany && (
            <motion.section variants={fadeInUp}>
              <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <QuickActionLink href={`/dashboard/${companies[0].slug}/edit`} icon={Settings} label="Edit Latest Page" />
                <QuickActionLink href={`/dashboard/${companies[0].slug}/preview`} icon={Eye} label="Preview Page" />
                <QuickActionLink href="/demo/techcorp/careers" icon={Sparkles} label="View Demo" />
              </div>
            </motion.section>
          )}

        </motion.div>
      </main>
    </div>
  );
}
