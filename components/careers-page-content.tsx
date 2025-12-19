"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Search,
  ExternalLink,
  X,
  Clock,
  DollarSign,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import type { Company, Job, ContentSection } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  fadeInUp,
  staggerContainer,
  slideInFromLeft,
  slideInFromRight,
  tabContent,
} from "@/lib/animations";

// --- Sub-components ---

const HeroSection = ({ company, jobCount }: { company: Company; jobCount: number }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative overflow-hidden py-24 text-white md:py-32"
    style={{
      background: `linear-gradient(135deg, ${company.primary_color} 0%, ${company.secondary_color} 100%)`,
    }}
  >
    {company.banner_url && (
      <div className="absolute inset-0 opacity-25">
        <Image
          src={company.banner_url}
          alt={`${company.name} banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    )}

    <div className="absolute inset-0 dot-pattern opacity-10" />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="container relative mx-auto px-4 text-center"
    >
      {company.logo_url && (
        <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
          <div className="group relative h-28 w-28 overflow-hidden rounded-3xl bg-white/15 p-4 backdrop-blur-md transition-transform hover:scale-105">
            <Image
              src={company.logo_url}
              alt={`${company.name} logo`}
              fill
              className="object-contain p-3"
              sizes="112px"
            />
          </div>
        </motion.div>
      )}

      <motion.h1 variants={fadeInUp} className="text-balance text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
        {company.name}
      </motion.h1>

      {company.tagline && (
        <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl text-balance text-xl font-medium opacity-90 md:text-2xl">
          {company.tagline}
        </motion.p>
      )}

      <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="rounded-full bg-white/20 px-6 py-2.5 text-sm font-bold backdrop-blur-md shadow-lg ring-1 ring-white/30"
        >
          {jobCount} Open {jobCount === 1 ? "Position" : "Positions"}
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.section>
);

const CompanyContent = ({ sections }: { sections: ContentSection[] }) => (
  <section className="border-b border-border/50 py-20 bg-muted/5">
    <div className="container mx-auto px-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-4xl space-y-16"
      >
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
            className="group space-y-5"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground/90 md:text-4xl relative inline-block">
              {section.title}
              <span className="absolute -bottom-2 left-0 h-1 w-12 bg-primary/40 rounded-full transition-all group-hover:w-full" />
            </h2>
            <p className="whitespace-pre-wrap text-pretty text-lg leading-relaxed text-muted-foreground/90 font-medium">
              {section.content}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

interface JobFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (type: string) => void;
  locations: string[];
  jobTypes: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
}

const JobFilterBar = ({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  jobTypeFilter,
  setJobTypeFilter,
  locations,
  jobTypes,
  clearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}: JobFilterBarProps) => (
  <Card className="mb-12 border-border/40 bg-card/40 backdrop-blur-lg shadow-2xl relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
    <CardContent className="p-6 md:p-10 relative">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search roles, skills, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-2xl text-lg font-medium shadow-inner"
            aria-label="Search jobs"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row flex-1">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="h-14 flex-1 bg-background/50 rounded-2xl border-border/50 font-medium text-muted-foreground" aria-label="Location">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <SelectValue placeholder="All Locations" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all">Everywhere</SelectItem>
              {locations.map((loc: string) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger className="h-14 flex-1 bg-background/50 rounded-2xl border-border/50 font-medium text-muted-foreground" aria-label="Job Type">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-primary" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type: string) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-14 gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl px-8 transition-all active:scale-95"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm font-semibold text-muted-foreground/80 flex items-center gap-3"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Showing {filteredCount} of {totalCount} matching positions
        </motion.p>
      )}
    </CardContent>
  </Card>
);

const JobGridCard = ({ job, onClick, primaryColor }: { job: Job; onClick: () => void; primaryColor: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <Card
      role="button"
      tabIndex={0}
      className="h-full border-border/50 bg-card/40 backdrop-blur-md transition-all border-l-4 group hover:shadow-2xl hover:border-primary"
      style={{ borderLeftColor: primaryColor }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardContent className="p-8 flex flex-col h-full">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-wider text-[10px]">
              {job.department || "General"}
            </Badge>
            <Badge variant="outline" className="border-border/50 font-bold uppercase tracking-wider text-[10px]">
              {job.job_type || "Full-time"}
            </Badge>
          </div>
          
          <h3 className="font-extrabold text-2xl leading-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
            {job.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-medium py-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/60" />
              {job.location}
            </div>
            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center gap-2 text-foreground/80">
                <DollarSign className="h-4 w-4 text-primary/60" />
                {job.salary_min && job.salary_max
                  ? `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                  : job.salary_min
                  ? `From ${job.salary_currency} ${job.salary_min.toLocaleString()}`
                  : `Up to ${job.salary_currency} ${job.salary_max?.toLocaleString()}`}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
          <span className="text-sm font-bold text-primary group-hover:underline inline-flex items-center gap-2">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const JobDetailModal = ({ job, isOpen, onClose, primaryColor }: { job: Job | null; isOpen: boolean; onClose: () => void; primaryColor: string }) => {
  if (!job) return null;

  const sections = [
    { title: "Responsibilities", data: job.responsibilities },
    { title: "Qualifications", data: job.qualifications },
    { title: "Benefits", data: job.benefits }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background/80 backdrop-blur-2xl shadow-3xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="sticky top-0 z-10 h-2 w-full" style={{ backgroundColor: primaryColor }} />
        
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-xs uppercase tracking-widest px-3 py-1">
                {job.department || "Engineering"}
              </Badge>
              <Badge variant="outline" className="font-extrabold text-xs uppercase tracking-widest px-3 py-1 border-border/50">
                {job.job_type}
              </Badge>
              {job.experience_level && (
                <Badge variant="outline" className="font-extrabold text-xs uppercase tracking-widest px-3 py-1 border-border/50">
                  {job.experience_level}
                </Badge>
              )}
            </div>
            
            <h2 className="text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl text-foreground leading-none">
              {job.title}
            </h2>
            
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-muted-foreground border-y border-border/20 py-6 font-bold text-lg">
              <span className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                {job.location}
              </span>
              <span className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                {job.experience_level || "Any Experience"}
              </span>
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center gap-3 text-foreground">
                  <DollarSign className="h-5 w-5 text-primary" />
                  {job.salary_min && job.salary_max
                    ? `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                    : job.salary_min
                    ? `From ${job.salary_currency} ${job.salary_min.toLocaleString()}`
                    : `Up to ${job.salary_currency} ${job.salary_max?.toLocaleString()}`}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-12">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              {job.description && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h3 className="text-xl font-black flex items-center gap-3 mb-6">
                    <span className="h-6 w-1.5 bg-primary rounded-full" />
                    Role Overview
                  </h3>
                  <p className="whitespace-pre-wrap text-muted-foreground/90 leading-relaxed text-lg font-medium">
                    {job.description}
                  </p>
                </div>
              )}
            </motion.div>

            {sections.map((section: any, index: number) => {
              const items = Array.isArray(section.data)
                ? section.data
                : typeof section.data === "string"
                ? section.data
                    .split("\n")
                    .map((s: string) => s.trim().replace(/^•\s*/, ""))
                    .filter(Boolean)
                : [];

              if (items.length === 0) return null;

              return (
                <motion.div 
                  key={section.title} 
                  variants={fadeInUp} 
                  initial="hidden" 
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <span className="h-6 w-1.5 bg-primary rounded-full" />
                    {section.title}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-all">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors flex-shrink-0" />
                        <span className="text-muted-foreground font-semibold leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}

            <div className="pt-12 border-t border-border/50">
              {job.application_url ? (
                <Button
                  asChild
                  className="w-full h-16 text-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group rounded-2xl"
                  size="lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Button>
              ) : (
                <Button
                  className="w-full h-16 text-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group rounded-2xl"
                  size="lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Apply Now
                  <ExternalLink className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              )}
              <p className="mt-6 text-center text-sm font-bold text-muted-foreground/60 tracking-tight">
                Quick Apply — Usually responds within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmptyJobState = ({ clearFilters, hasActiveFilters, initial }: { clearFilters: () => void; hasActiveFilters: boolean; initial: boolean }) => (
  <Card className="border-border/40 bg-card/40 backdrop-blur-md">
    <CardContent className="flex flex-col items-center justify-center p-20 text-center">
      <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-8">
        <Briefcase className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-2xl font-bold text-foreground/90">
        {initial ? "Join Our Growing Team" : "No Positions Found"}
      </h3>
      <p className="mt-3 max-w-sm text-balance text-muted-foreground/80 leading-relaxed font-medium">
        {initial
          ? "We're always looking for exceptional talent to join our world-class team. Check back soon for new opportunities!"
          : "We couldn't find any positions matching your current filters. Try broadening your search or resetting the filters."}
      </p>
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="mt-8 border-primary/20 hover:bg-primary/5 rounded-xl h-11 px-8 font-semibold"
          onClick={clearFilters}
        >
          Reset All Filters
        </Button>
      )}
    </CardContent>
  </Card>
);

// --- Main Component ---

interface CareersPageContentProps {
  company: Company;
  jobs: Job[];
}

export function CareersPageContent({ company, jobs }: CareersPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const locations = useMemo(() => {
    return Array.from(new Set(jobs.map((job: Job) => job.location))).sort();
  }, [jobs]);

  const jobTypes = useMemo(() => {
    return Array.from(new Set(jobs.map((job: Job) => job.job_type))).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: Job) => {
      const matchesSearch = searchQuery === "" || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter === "all" || job.location === locationFilter;
      const matchesJobType = jobTypeFilter === "all" || job.job_type === jobTypeFilter;
      const isActive = job.is_active !== false;
      return matchesSearch && matchesLocation && matchesJobType && isActive;
    });
  }, [jobs, searchQuery, locationFilter, jobTypeFilter]);

  const sortedSections = useMemo(() => {
    if (!company.content_sections) return [];
    return [...company.content_sections].sort((a, b) => a.order - b.order);
  }, [company.content_sections]);

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setJobTypeFilter("all");
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const hasActiveFilters = searchQuery !== "" || locationFilter !== "all" || jobTypeFilter !== "all";

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <HeroSection company={company} jobCount={jobs.length} />

      {sortedSections.length > 0 && <CompanyContent sections={sortedSections} />}

      {company.culture_video_url && (
        <section className="border-b border-border/50 py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-5xl"
            >
              <h2 className="mb-12 text-center text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl">
                Life at {company.name}
              </h2>
              <div className="group relative aspect-video overflow-hidden rounded-[3rem] border border-border/40 shadow-3xl transition-all hover:scale-[1.01]">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                <iframe
                  src={company.culture_video_url.replace("watch?v=", "embed/")}
                  title="Culture video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full relative z-0"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-32 bg-muted/5 relative" id="jobs">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-5xl font-black tracking-tighter md:text-6xl lg:text-7xl text-foreground">
              Open Positions
            </h2>
            <p className="mt-6 text-xl font-bold text-muted-foreground/80 max-w-3xl mx-auto">
              We&apos;re looking for creative, passionate people to help us build the future. 
              Find your next challenge below.
            </p>
          </motion.div>

          <JobFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            jobTypeFilter={jobTypeFilter}
            setJobTypeFilter={setJobTypeFilter}
            locations={locations}
            jobTypes={jobTypes}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            filteredCount={filteredJobs.length}
            totalCount={jobs.length}
          />

          <AnimatePresence mode="popLayout" initial={false}>
            {filteredJobs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <EmptyJobState 
                  clearFilters={clearFilters} 
                  hasActiveFilters={hasActiveFilters} 
                  initial={jobs.length === 0} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredJobs.map((job: Job) => (
                  <JobGridCard
                    key={job.id}
                    job={job}
                    onClick={() => handleJobClick(job)}
                    primaryColor={company.primary_color}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <JobDetailModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        primaryColor={company.primary_color}
      />

      <footer className="border-t border-border/40 py-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center grayscale opacity-50 contrast-125 transition-all hover:grayscale-0 hover:opacity-100">
             {company.logo_url && (
              <div className="relative h-14 w-14">
                <Image
                  src={company.logo_url}
                  alt={company.name}
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-muted-foreground/80 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {company.name}. Build your future with us.
          </p>
          <p className="mt-6 text-xs font-black tracking-[0.2em] uppercase text-muted-foreground/30">
            Powered by{" "}
            <Link href="/" className="text-primary/60 hover:text-primary transition-colors underline-offset-4 hover:underline">
              Whitecarrot Careers
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
