"use client";

import type React from "react";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  Briefcase,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import Image from "next/image";

const features = [
  { icon: Shield, label: "Enterprise Security" },
  { icon: Zap, label: "Lightning Fast" },
  { icon: Users, label: "Team Collaboration" },
];

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace(redirectTo);
      }
    };
    checkUser();
  }, [router, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      router.replace(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to manage your careers page</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="h-12 w-full font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 gradient-mesh opacity-40" />
      <div className="fixed inset-0 -z-10 dot-pattern opacity-20" />

      {/* Left side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden w-1/2 flex-col justify-center p-12 lg:flex relative"
      >
        {/* Decorative gradient orb */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

        <div className="mx-auto max-w-lg relative z-10">
            <Link href="/" className="flex items-center gap-2.5 group mb-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-12 rounded-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight">Whitecarrot</h1>
              <h3 className="text-sm text-muted-foreground font-semibold">Build your future</h3>
            </div>
          </Link>

          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Build careers pages that{" "}
            <span className="text-gradient">attract top talent</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Create stunning, branded careers pages in minutes. No design skills
            required.
          </p>

          <div className="mt-10 flex gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-4 w-4" />
                </div>
                <span>{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile back button */}
          <motion.div variants={fadeInUp} className="mb-6 lg:hidden">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-background/50"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </motion.div>

          {/* Mobile logo */}
          <motion.div
            variants={fadeInUp}
            className="mb-8 text-center lg:hidden"
          >
               <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-12 rounded-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-tight">Whitecarrot</h1>
              <h3 className="text-sm text-muted-foreground font-semibold">Build your future</h3>
            </div>
          </Link>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Suspense
              fallback={
                <div className="h-96 animate-pulse bg-card/50 rounded-xl" />
              }
            >
              <LoginForm />
            </Suspense>
          </motion.div>

          {/* Desktop back link */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 text-center hidden lg:block"
          >
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
