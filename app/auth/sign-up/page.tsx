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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  Briefcase,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

const benefits = [
  "Unlimited careers pages",
  "Custom branding & themes",
  "Built-in job management",
  "Real-time analytics",
];

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      }
    };
    checkUser();
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) throw error;

      if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists");
        return;
      }

      // Redirect to verify email page
      router.push("/auth/verify-email");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign up"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "",
      "bg-destructive",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-500",
    ];
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 gradient-mesh opacity-40" />
      <div className="fixed inset-0 -z-10 dot-pattern opacity-20" />

      {/* Left side - Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden w-1/2 flex-col justify-center p-12 lg:flex relative"
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

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
            Start building your{" "}
            <span className="text-gradient">careers page</span> today
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Join thousands of companies attracting top talent with beautiful,
            branded careers pages.
          </p>

          <ul className="mt-10 space-y-4">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </motion.li>
            ))}
          </ul>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                Free forever
              </span>{" "}
              for small teams. No credit card required.
            </p>
          </motion.div>
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
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold">
                  Create your account
                </CardTitle>
                <CardDescription>
                  Get started with your free careers page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Jane Smith"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          autoComplete="name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyName"
                          className="text-sm font-medium"
                        >
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Acme Corp"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          disabled={isLoading}
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          autoComplete="organization"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Work Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                        autoComplete="email"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
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
                            className="h-11 bg-background/50 border-border/50 focus:border-primary transition-colors pr-10"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="repeatPassword"
                          className="text-sm font-medium"
                        >
                          Confirm
                        </Label>
                        <Input
                          id="repeatPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          disabled={isLoading}
                          className="h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    {/* Password strength indicator */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.strength
                                  ? passwordStrength.color
                                  : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Password strength:{" "}
                          <span className="font-medium">
                            {passwordStrength.label}
                          </span>
                        </p>
                      </motion.div>
                    )}

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
                      className="h-11 w-full font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </div>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Terms notice */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            By creating an account, you agree to our{" "}
            <Link
              href="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
