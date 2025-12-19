"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { ArrowLeft, Loader2, Briefcase, Globe, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CreateCompanyPage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Auto-generate slug from company name
  const handleNameChange = (value: string) => {
    setName(value)
    const generatedSlug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    setSlug(generatedSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Check if slug is already taken
      const { data: existing } = await supabase.from("companies").select("slug").eq("slug", slug).single()

      if (existing) {
        setError("This URL is already taken. Please choose a different one.")
        setIsLoading(false)
        return
      }

      // Create company with default sections
      const { data, error: insertError } = await supabase
        .from("companies")
        .insert({
          user_id: user.id,
          name,
          slug,
          tagline,
          description,
          content_sections: [
            {
              id: "about",
              type: "about",
              title: "About Us",
              content: description || "We are building something great.",
              order: 0,
            },
            {
              id: "culture",
              type: "culture",
              title: "Life at " + name,
              content: "Join our team and make an impact.",
              order: 1,
            },
          ],
        })
        .select()
        .maybeSingle()

      if (insertError) throw insertError

      router.push(`/dashboard/${data.slug}/edit`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10 gradient-mesh opacity-30" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create Your Careers Page</h1>
            <p className="mt-2 text-muted-foreground">Set up your company page with basic information</p>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeInUp}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>This information will be displayed on your public careers page</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Acme Corporation"
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Page URL *</Label>
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-background p-1 pl-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">yoursite.com/</span>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="acme-corp"
                        required
                        disabled={isLoading}
                        pattern="[a-z0-9-]+"
                        title="Only lowercase letters, numbers, and hyphens"
                        className="h-9 border-0 bg-transparent px-1 focus-visible:ring-0"
                      />
                      <span className="text-sm text-muted-foreground">/careers</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only lowercase letters, numbers, and hyphens are allowed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Building the future of technology"
                      disabled={isLoading}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">A short, catchy phrase about your company.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell candidates about your company, mission, and what makes you unique..."
                      rows={4}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button type="submit" className="h-11 w-full gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Create Careers Page
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div variants={fadeInUp}>
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold">Tips for a great careers page</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    Use a clear, memorable URL that represents your brand
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    Write a compelling tagline that captures your mission
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    Keep your description concise but informative
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
