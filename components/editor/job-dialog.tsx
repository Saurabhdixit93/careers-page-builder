"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, Briefcase, MapPin, ListChecks, Heart, Info, Plus, Trash2, DollarSign, Globe } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { type Job } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getChangedFields, cn } from "@/lib/utils";

// --- Schema & Types ---

const jobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  department: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  job_type: z.string(),
  experience_level: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.array(z.string().min(1, "Item cannot be empty")),
  qualifications: z.array(z.string().min(1, "Item cannot be empty")),
  benefits: z.array(z.string().min(1, "Item cannot be empty")),
  salary_min: z.string().optional().or(z.number().optional()),
  salary_max: z.string().optional().or(z.number().optional()),
  salary_currency: z.string().default("USD"),
  application_url: z.string().url("Please enter a valid URL").optional().or(z.string().length(0)),
  is_active: z.boolean(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  companyId: string;
  onSave: (job: Job) => void;
}

// --- Sub-components ---

const FormField = ({ label, id, error, children, icon: Icon }: { 
  label: string; 
  id: string; 
  error?: string; 
  children: React.ReactNode;
  icon?: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1">{error}</p>}
  </div>
);

interface DynamicListInputProps {
  name: "responsibilities" | "qualifications" | "benefits";
  control: Control<JobFormValues>;
  register: any;
  errors: any;
  placeholder: string;
}

const DynamicListInput = ({ name, control, register, errors, placeholder }: DynamicListInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {fields.map((field, index) => {
          const fieldError = errors[name]?.[index];
          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Input
                  {...register(`${name}.${index}` as const)}
                  placeholder={placeholder}
                  className={cn(
                    "h-10 transition-all focus:border-primary/50",
                    fieldError && "border-destructive/50 focus:border-destructive"
                  )}
                />
                {fieldError && (
                  <p className="absolute -bottom-5 left-1 text-[10px] text-destructive">
                    {fieldError.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
        className="h-10 w-full border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

// --- Main Component ---

export function JobDialog({
  isOpen,
  onClose,
  job,
  companyId,
  onSave,
}: JobDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = useMemo(() => ({
    title: job?.title || "",
    department: job?.department || "",
    location: job?.location || "",
    job_type: job?.job_type || "Full-time",
    experience_level: job?.experience_level || "",
    description: job?.description || "",
    responsibilities: Array.isArray(job?.responsibilities) ? job.responsibilities : [],
    qualifications: Array.isArray(job?.qualifications) ? job.qualifications : [],
    benefits: Array.isArray(job?.benefits) ? job.benefits : [],
    salary_min: job?.salary_min?.toString() || "",
    salary_max: job?.salary_max?.toString() || "",
    salary_currency: job?.salary_currency || "USD",
    application_url: job?.application_url || "",
    is_active: job?.is_active ?? true,
  }), [job, isOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues,
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = async (values: JobFormValues) => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      const payload = {
        ...values,
        salary_min: values.salary_min ? parseInt(values.salary_min.toString(), 10) : null,
        salary_max: values.salary_max ? parseInt(values.salary_max.toString(), 10) : null,
        application_url: values.application_url || null,
      };

      if (job) {
        // For existing jobs, we compare simple fields and handle arrays separately
        const changedFields = getChangedFields(defaultValues, values);

        if (Object.keys(changedFields).length === 0) {
          onClose();
          return;
        }

        // Process changes to ensure correct types for DB
        const processedChanges: any = { ...changedFields };
        if (changedFields.salary_min !== undefined) processedChanges.salary_min = payload.salary_min;
        if (changedFields.salary_max !== undefined) processedChanges.salary_max = payload.salary_max;
        if (changedFields.application_url !== undefined) processedChanges.application_url = payload.application_url;

        const { data, error: updateError } = await supabase
          .from("jobs")
          .update({
            ...processedChanges,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id)
          .select()
          .single();

        if (updateError) throw updateError;
        onSave(data);
        toast.success("Job updated successfully!");
      } else {
        const { data, error: insertError } = await supabase
          .from("jobs")
          .insert({
            ...payload,
            company_id: companyId,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        onSave(data);
        toast.success("Job created successfully!");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && (open ? null : onClose())}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-0 gap-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="p-6 md:p-8 border-b border-border/50 bg-muted/30">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {job ? "Edit Job Posting" : "Create New Job"}
                </DialogTitle>
                <DialogDescription className="text-md">
                  {job ? "Refine the details for this position." : "Post a new opportunity to attract top talent."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
                {/* Basic Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Job Title *" id="title" error={errors.title?.message} icon={Briefcase}>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="e.g., Senior Product Designer"
                      disabled={isLoading}
                      className="h-11 transition-all focus:border-primary/50"
                    />
                  </FormField>

                  <FormField label="Department" id="department" icon={Info}>
                    <Input
                      id="department"
                      {...register("department")}
                      placeholder="e.g., Design Team"
                      disabled={isLoading}
                      className="h-11 transition-all focus:border-primary/50"
                    />
                  </FormField>
                </div>

                {/* Location & Type */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Location *" id="location" error={errors.location?.message} icon={MapPin}>
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="e.g., Remote / New York"
                      disabled={isLoading}
                      className="h-11 transition-all focus:border-primary/50"
                    />
                  </FormField>

                  <FormField label="Job Type *" id="job_type">
                    <Select
                      value={watchedValues.job_type}
                      onValueChange={(value) => setValue("job_type", value, { shouldDirty: true })}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="job_type" className="h-11 transition-all focus:border-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Experience Level" id="experience_level">
                    <Select
                      value={watchedValues.experience_level}
                      onValueChange={(value) => setValue("experience_level", value, { shouldDirty: true })}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="experience_level" className="h-11 transition-all focus:border-primary/50">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Application URL (External)" id="application_url" error={errors.application_url?.message} icon={Globe}>
                    <Input
                      id="application_url"
                      {...register("application_url")}
                      placeholder="https://example.com/apply"
                      disabled={isLoading}
                      className="h-11 transition-all focus:border-primary/50"
                    />
                  </FormField>
                </div>

                {/* Compensation */}
                <div className="space-y-4">
                   <Label className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Compensation
                  </Label>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Input
                      type="number"
                      {...register("salary_min")}
                      placeholder="Min Salary"
                      disabled={isLoading}
                      className="h-11"
                    />
                    <Input
                      type="number"
                      {...register("salary_max")}
                      placeholder="Max Salary"
                      disabled={isLoading}
                      className="h-11"
                    />
                    <Select
                      value={watchedValues.salary_currency}
                      onValueChange={(value) => setValue("salary_currency", value, { shouldDirty: true })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description & Details */}
                <FormField label="Overview / Description" id="description">
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Briefly describe the role..."
                    rows={3}
                    disabled={isLoading}
                    className="resize-none focus:border-primary/50"
                  />
                </FormField>

                <div className="grid gap-8">
                  <FormField label="Responsibilities" id="responsibilities" icon={ListChecks} error={errors.responsibilities?.message}>
                    <DynamicListInput 
                      name="responsibilities" 
                      control={control} 
                      register={register}
                      errors={errors} 
                      placeholder="e.g., Design user interfaces and interactions" 
                    />
                  </FormField>

                  <FormField label="Qualifications" id="qualifications" icon={ListChecks} error={errors.qualifications?.message}>
                    <DynamicListInput 
                      name="qualifications" 
                      control={control} 
                      register={register}
                      errors={errors} 
                      placeholder="e.g., 5+ years of experience in product design" 
                    />
                  </FormField>

                  <FormField label="Benefits" id="benefits" icon={Heart} error={errors.benefits?.message}>
                    <DynamicListInput 
                      name="benefits" 
                      control={control} 
                      register={register}
                      errors={errors} 
                      placeholder="e.g., Competitive salary and equity" 
                    />
                  </FormField>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-5 transition-colors hover:bg-muted/30">
                  <div className="space-y-1">
                    <Label htmlFor="is_active" className="text-base font-semibold">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to make this job visible on your careers page.
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={watchedValues.is_active}
                    onCheckedChange={(checked) => setValue("is_active", checked, { shouldDirty: true })}
                    disabled={isLoading}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isLoading}
                    className="h-11 px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || (!isDirty && !!job)} 
                    className="h-11 px-10 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4 mr-2" /> {job ? "Save Changes" : "Post Job"}</>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
