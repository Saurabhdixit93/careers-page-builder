"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Briefcase, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import Image from "next/image";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const message = searchParams.get("message");

  const displayMessage =
    errorDescription ||
    message ||
    error ||
    "An unexpected error occurred. Please try again.";

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="text-center pb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20"
        >
          <AlertCircle className="h-8 w-8 text-destructive" />
        </motion.div>
        <CardTitle className="text-2xl font-bold">
          Authentication Error
        </CardTitle>
        <CardDescription>Something went wrong</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-center text-sm text-destructive">
            {displayMessage}
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full h-11 font-semibold">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full h-11 bg-transparent"
          >
            <Link href="/auth/sign-up">
              <RefreshCw className="mr-2 h-4 w-4" />
              Create new account
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6">
      {/* Background */}
      <div className="fixed inset-0 -z-10 gradient-mesh opacity-40" />
      <div className="fixed inset-0 -z-10 dot-pattern opacity-20" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="mb-8 text-center">
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
              <div className="h-64 animate-pulse bg-card/50 rounded-xl" />
            }
          >
            <ErrorContent />
          </Suspense>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          Need help?{" "}
          <Link
            href="mailto:support@Whitecarrot.com"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Contact support
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
