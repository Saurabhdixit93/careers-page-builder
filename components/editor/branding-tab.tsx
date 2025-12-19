"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm, UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle2, ImageIcon, Video, Palette, Globe } from "lucide-react"
import { toast } from "sonner"

import { type Company } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { getChangedFields } from "@/lib/utils"

// --- Schema & Types ---

const brandingSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo_url: z.string().url("Invalid logo URL").or(z.literal("")).optional(),
  banner_url: z.string().url("Invalid banner URL").or(z.literal("")).optional(),
  culture_video_url: z.string().url("Invalid video URL").or(z.literal("")).optional(),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  is_published: z.boolean(),
})

type BrandingFormValues = z.infer<typeof brandingSchema>

interface BrandingTabProps {
  company: Company
  setCompany: (company: Company) => void
}

// --- Sub-components ---

const FormSection = ({ title, description, icon: Icon, children }: { 
  title: string; 
  description: string; 
  icon: any; 
  children: React.ReactNode 
}) => (
  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

const CompanyInfo = ({ register, errors, isLoading }: { 
  register: UseFormRegister<BrandingFormValues>, 
  errors: FieldErrors<BrandingFormValues>,
  isLoading: boolean 
}) => (
  <FormSection title="Company Information" description="Update your company name, tagline, and description" icon={Globe}>
    <div className="space-y-2">
      <Label htmlFor="name">Company Name *</Label>
      <Input
        id="name"
        {...register("name")}
        disabled={isLoading}
        className={errors.name ? "border-destructive" : ""}
      />
      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="tagline">Tagline</Label>
      <Input
        id="tagline"
        {...register("tagline")}
        placeholder="A short, catchy phrase"
        disabled={isLoading}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        {...register("description")}
        placeholder="Tell candidates about your company..."
        rows={4}
        disabled={isLoading}
      />
    </div>
  </FormSection>
);

const VisualAssets = ({ register, errors, isLoading, watchedValues }: { 
  register: UseFormRegister<BrandingFormValues>, 
  errors: FieldErrors<BrandingFormValues>,
  isLoading: boolean,
  watchedValues: BrandingFormValues
}) => (
  <FormSection title="Visual Assets" description="Add your logo, banner, and culture video" icon={ImageIcon}>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input id="logo_url" type="url" {...register("logo_url")} placeholder="https://..." disabled={isLoading} />
        {errors.logo_url && <p className="text-xs text-destructive">{errors.logo_url.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="banner_url">Banner URL</Label>
        <Input id="banner_url" type="url" {...register("banner_url")} placeholder="https://..." disabled={isLoading} />
        {errors.banner_url && <p className="text-xs text-destructive">{errors.banner_url.message}</p>}
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="culture_video_url" className="flex items-center gap-2">
        <Video className="h-4 w-4" /> Culture Video URL
      </Label>
      <Input id="culture_video_url" type="url" {...register("culture_video_url")} placeholder="YouTube/Vimeo link" disabled={isLoading} />
    </div>

    <AnimatePresence>
      {(watchedValues.logo_url || watchedValues.banner_url) && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 mt-2">
            <p className="mb-3 text-sm font-medium">Visual Preview</p>
            <div className="flex items-center gap-4">
              {watchedValues.logo_url && (
                <img src={watchedValues.logo_url} alt="Logo" className="h-16 w-16 rounded-lg object-cover bg-white" onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
              {watchedValues.banner_url && (
                <img src={watchedValues.banner_url} alt="Banner" className="h-16 flex-1 rounded-lg object-cover bg-white" onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </FormSection>
);

const BrandColors = ({ watchedValues, setValue, isLoading, errors }: { 
  watchedValues: BrandingFormValues, 
  setValue: UseFormSetValue<BrandingFormValues>,
  isLoading: boolean,
  errors: FieldErrors<BrandingFormValues>
}) => (
  <FormSection title="Brand Colors" description="Choose colors that match your brand identity" icon={Palette}>
    <div className="grid gap-4 md:grid-cols-2">
      {["primary_color", "secondary_color"].map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field}>{field === "primary_color" ? "Primary" : "Secondary"} Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={watchedValues[field as keyof BrandingFormValues] as string}
              onChange={(e) => setValue(field as any, e.target.value, { shouldDirty: true })}
              className="h-11 w-14 cursor-pointer p-1"
              disabled={isLoading}
            />
            <Input
              value={watchedValues[field as keyof BrandingFormValues] as string}
              onChange={(e) => setValue(field as any, e.target.value, { shouldDirty: true })}
              disabled={isLoading}
              className="h-11 font-mono"
            />
          </div>
          {errors[field as keyof BrandingFormValues] && <p className="text-xs text-destructive">{errors[field as keyof BrandingFormValues]?.message}</p>}
        </div>
      ))}
    </div>
    <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
      <p className="mb-3 text-sm font-medium">Gradient Preview</p>
      <div
        className="h-20 rounded-lg transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${watchedValues.primary_color} 0%, ${watchedValues.secondary_color} 100%)`,
        }}
      />
    </div>
  </FormSection>
);

// --- Main Component ---

export function BrandingTab({ company, setCompany }: BrandingTabProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const defaultValues = useMemo(() => ({
    name: company.name,
    tagline: company.tagline || "",
    description: company.description || "",
    logo_url: company.logo_url || "",
    banner_url: company.banner_url || "",
    culture_video_url: company.culture_video_url || "",
    primary_color: company.primary_color,
    secondary_color: company.secondary_color,
    is_published: company.is_published,
  }), [company])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues,
  })

  const watchedValues = watch()

  const onSubmit = async (values: BrandingFormValues) => {
    const changedFields = getChangedFields(defaultValues, values)
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes to save")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error: updateError } = await supabase
        .from("companies")
        .update({
          ...changedFields,
          updated_at: new Date().toISOString(),
        })
        .eq("id", company.id)
        .select()
        .single()

      if (updateError) throw updateError

      setCompany(data)
      reset(values)
      toast.success("Changes saved successfully!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CompanyInfo register={register} errors={errors} isLoading={isLoading} />
      
      <VisualAssets register={register} errors={errors} isLoading={isLoading} watchedValues={watchedValues} />
      
      <BrandColors watchedValues={watchedValues} setValue={setValue} isLoading={isLoading} errors={errors} />

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
          <CardDescription>Control whether your careers page is publicly visible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_published" className="text-base font-medium">Publish Careers Page</Label>
              <p className="text-sm text-muted-foreground">Make your careers page visible to the public</p>
            </div>
            <Switch
              id="is_published"
              checked={watchedValues.is_published}
              onCheckedChange={(checked) => setValue("is_published", checked, { shouldDirty: true })}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading || !isDirty} className="h-12 w-full gap-2 md:w-auto px-8 transition-all hover:scale-[1.02]">
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          <><CheckCircle2 className="h-4 w-4" /> Save Changes</>
        )}
      </Button>
    </form>
  )
}
