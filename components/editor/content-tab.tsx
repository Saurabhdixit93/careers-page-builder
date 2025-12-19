"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, CheckCircle2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { type Company } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getChangedFields } from "@/lib/utils";

// --- Schema & Types ---

const sectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  order: z.number(),
});

const contentSchema = z.object({
  content_sections: z.array(sectionSchema),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentTabProps {
  company: Company;
  setCompany: (company: Company) => void;
}

// --- Sub-components ---

const EmptyState = ({ onAdd, isLoading }: { onAdd: () => void; isLoading: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border-2 border-dashed border-border/50 p-12 text-center bg-muted/20 backdrop-blur-sm"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-full bg-primary/10 p-4">
        <FileText className="h-8 w-8 text-primary/60" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">No sections yet</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
          Add custom sections like &quot;Why Join Us?&quot; or &quot;Our Culture&quot; to attract candidates.
        </p>
      </div>
      <Button 
        type="button" 
        onClick={onAdd} 
        disabled={isLoading}
        variant="outline"
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add First Section
      </Button>
    </div>
  </motion.div>
);

const SectionCard = ({ 
  index, 
  field, 
  total, 
  register, 
  errors, 
  isLoading, 
  onMove, 
  onRemove 
}: { 
  index: number;
  field: any;
  total: number;
  register: UseFormRegister<ContentFormValues>;
  errors: FieldErrors<ContentFormValues>;
  isLoading: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="group border-2 border-border/50 bg-card/30 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-4">
            {/* Reorder Buttons */}
            <div className="mt-1 flex flex-col gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onMove(index, index - 1)}
                disabled={index === 0 || isLoading}
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                title="Move Up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onMove(index, index + 1)}
                disabled={index === total - 1 || isLoading}
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                title="Move Down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`content_sections.${index}.title`} className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Section Title
                </Label>
                <Input
                  {...register(`content_sections.${index}.title` as const)}
                  placeholder="e.g., Why Join Us?"
                  disabled={isLoading}
                  className={`h-11 transition-all ${errors.content_sections?.[index]?.title ? "border-destructive focus-visible:ring-destructive" : "focus:border-primary/50"}`}
                />
                {errors.content_sections?.[index]?.title && (
                  <p className="text-xs text-destructive">{errors.content_sections[index]?.title?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`content_sections.${index}.content`} className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Content
                </Label>
                <Textarea
                  {...register(`content_sections.${index}.content` as const)}
                  placeholder="Tell candidates what makes this section special..."
                  rows={4}
                  disabled={isLoading}
                  className={`resize-none transition-all ${errors.content_sections?.[index]?.content ? "border-destructive focus-visible:ring-destructive" : "focus:border-primary/50"}`}
                />
                {errors.content_sections?.[index]?.content && (
                  <p className="text-xs text-destructive">{errors.content_sections[index]?.content?.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            disabled={isLoading}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Remove Section"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  </motion.div>
);

// --- Main Component ---

export function ContentTab({ company, setCompany }: ContentTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultValues = useMemo(() => ({
    content_sections: company.content_sections || [],
  }), [company.content_sections]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "content_sections",
  });

  // Update form when company changes
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const addSection = () => {
    append({
      id: `section-${Date.now()}`,
      type: "custom",
      title: "",
      content: "",
      order: fields.length,
    });
  };

  const onSubmit = async (values: ContentFormValues) => {
    const supabase = createClient();
    setIsLoading(true);

    try {
      const changedFields = getChangedFields(defaultValues, values);

      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes to save");
        setIsLoading(false);
        return;
      }

      const { data, error: updateError } = await supabase
        .from("companies")
        .update({
          ...changedFields,
          updated_at: new Date().toISOString(),
        })
        .eq("id", company.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCompany(data);
      reset(values);
      toast.success("Sections saved successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Content Sections</CardTitle>
              <CardDescription className="text-md">
                Customize the narrative of your careers page with dynamic sections.
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={addSection}
              disabled={isLoading}
              className="md:w-auto h-11 px-6 shadow-sm hover:shadow-primary/20 transition-all font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {fields.length === 0 ? (
                <EmptyState onAdd={addSection} isLoading={isLoading} />
              ) : (
                fields.map((field, index) => (
                  <SectionCard
                    key={field.id}
                    index={index}
                    field={field}
                    total={fields.length}
                    register={register}
                    errors={errors}
                    isLoading={isLoading}
                    onMove={move}
                    onRemove={remove}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4">
        {isDirty && (
          <p className="text-sm text-amber-500 font-medium animate-pulse">
            You have unsaved changes
          </p>
        )}
        <Button 
          type="submit" 
          disabled={isLoading || !isDirty} 
          className="w-full md:w-64 h-12 text-md shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          size="lg"
        >
          {isLoading ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><CheckCircle2 className="h-5 w-5 mr-2" /> Save Sections</>
          )}
        </Button>
      </div>
    </form>
  );
}
