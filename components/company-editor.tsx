"use client"

import type { Company, Job } from "@/lib/types"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink, Eye, Briefcase, Palette, FileText, ArrowLeft } from "lucide-react"
import { BrandingTab } from "@/components/editor/branding-tab"
import { ContentTab } from "@/components/editor/content-tab"
import { JobsTab } from "@/components/editor/jobs-tab"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, tabContent } from "@/lib/animations"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface CompanyEditorProps {
  company: Company
  jobs: Job[]
}

// --- Tab Configuration ---

const TABS = [
  { id: "branding", label: "Branding", icon: Palette },
  { id: "content", label: "Content", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Briefcase },
] as const;

type TabId = (typeof TABS)[number]["id"];

// --- Sub-components ---

const EditorHeader = ({ company, jobsCount }: { company: Company; jobsCount: number }) => (
  <header className="sticky top-0 z-50 border-b border-border/50 glass">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 transition-colors hover:bg-muted/50">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </Button>
        <div className="h-6 w-px bg-border/50" />
        <div className="flex flex-col">
          <h1 className="font-bold tracking-tight text-sm sm:text-base leading-tight">
            {company.name}
          </h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium opacity-70">
            /{company.slug}/careers
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all">
          <Link href={`/dashboard/${company.slug}/preview`} target="_blank">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Link>
        </Button>
        {company.is_published && (
          <Button asChild variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all">
            <Link href={`/${company.slug}/careers`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View Live</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  </header>
);

// --- Main Component ---

export function CompanyEditor({ company: initialCompany, jobs: initialJobs }: CompanyEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [company, setCompany] = useState<Company>(initialCompany);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  // Sync active tab with URL search params
  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return (TABS.find(t => t.id === tab)?.id || "branding") as TabId;
  }, [searchParams]);

  const handleTabChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/10">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 gradient-mesh opacity-[0.15]" />
      </div>

      <EditorHeader company={company} jobsCount={jobs.length} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="space-y-8"
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <TabsList className="bg-muted/30 backdrop-blur-md border border-border/50 p-1 w-full max-w-md">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id} 
                      className={cn(
                        "flex-1 gap-2.5 h-9 font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                        "hover:text-foreground/80 focus-visible:ring-1 focus-visible:ring-primary/20"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
                      {tab.id === "jobs" && jobs.length > 0 && (
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20 ml-0.5">
                          {jobs.length}
                        </span>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabContent}
                className="focus-visible:outline-none"
              >
                <TabsContent value="branding" className="mt-0 focus-visible:outline-none border-none ring-0">
                  <BrandingTab company={company} setCompany={setCompany} />
                </TabsContent>

                <TabsContent value="content" className="mt-0 focus-visible:outline-none border-none ring-0">
                  <ContentTab company={company} setCompany={setCompany} />
                </TabsContent>

                <TabsContent value="jobs" className="mt-0 focus-visible:outline-none border-none ring-0">
                  <JobsTab company={company} jobs={jobs} setJobs={setJobs} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
