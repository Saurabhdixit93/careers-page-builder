"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, MapPin, Briefcase, Search, Filter, DollarSign } from "lucide-react"
import { toast } from "sonner"

import { type Company, type Job } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobDialog } from "@/components/editor/job-dialog"
import { Badge } from "../ui/badge" 

interface JobsTabProps {
  company: Company
  jobs: Job[]
  setJobs: (jobs: Job[]) => void
}

// --- Sub-components ---

const EmptyJobsState = ({ onCreate }: { onCreate: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-xl border-2 border-dashed border-border/50 p-16 text-center bg-muted/20 backdrop-blur-sm"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-full bg-primary/10 p-5 shadow-inner">
        <Briefcase className="h-10 w-10 text-primary/60" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">No job postings yet</h3>
        <p className="text-muted-foreground max-w-[300px] mx-auto text-md">
          Start building your team by posting your first job opening.
        </p>
      </div>
      <Button 
        onClick={onCreate} 
        size="lg"
        className="mt-4 px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
      >
        <Plus className="mr-2 h-5 w-5" />
        Post Your First Job
      </Button>
    </div>
  </motion.div>
);

const JobListItem = ({ job, onEdit, onDelete, isDeleting }: { 
  job: Job; 
  onEdit: (job: Job) => void; 
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="group"
  >
    <Card className="border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="text-lg font-bold tracking-tight">{job.title}</h3>
            {job.is_active ? (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
            )}
            {job.job_type && (
              <Badge variant="outline" className="font-normal">{job.job_type}</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {job.department && (
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                {job.department}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            {job.experience_level && (
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                {job.experience_level}
              </span>
            )}
            {(job.salary_min || job.salary_max) && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <DollarSign className="h-3.5 w-3.5" />
                {job.salary_min && job.salary_max
                  ? `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                  : job.salary_min
                  ? `From ${job.salary_currency} ${job.salary_min.toLocaleString()}`
                  : `Up to ${job.salary_currency} ${job.salary_max?.toLocaleString()}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(job)} 
            className="h-9 px-4 bg-transparent hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(job.id)}
            disabled={isDeleting}
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// --- Main Component ---

export function JobsTab({ company, jobs, setJobs }: JobsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingJob(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return

    setIsDeletingId(jobId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)
      if (error) throw error

      setJobs(jobs.filter((j) => j.id !== jobId))
      toast.success("Job posting deleted successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete job")
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleSave = (job: Job) => {
    const existingIndex = jobs.findIndex((j) => j.id === job.id)
    if (existingIndex >= 0) {
      const updated = [...jobs]
      updated[existingIndex] = job
      setJobs(updated)
    } else {
      setJobs([job, ...jobs])
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">Job Postings</CardTitle>
              <CardDescription className="text-md">
                Manage and publish open positions for {company.name}.
              </CardDescription>
            </div>
            <Button 
              onClick={handleCreate}
              className="md:w-auto h-11 px-6 shadow-md hover:shadow-primary/20 transition-all font-medium"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Job
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {jobs.length === 0 ? (
                <EmptyJobsState onCreate={handleCreate} key="empty" />
              ) : (
                jobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeletingId === job.id}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <JobDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        job={editingJob}
        companyId={company.id}
        onSave={handleSave}
      />
    </div>
  )
}
