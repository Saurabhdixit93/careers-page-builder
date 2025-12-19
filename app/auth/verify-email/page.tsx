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
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Briefcase, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function VerifyEmailPage() {
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
          <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
              >
                <Mail className="h-8 w-8 text-emerald-500" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">
                Check your email
              </CardTitle>
              <CardDescription>We sent you a verification link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground leading-relaxed">
                  Please check your email inbox and click the verification link
                  to activate your account. Once verified, you&apos;ll be
                  automatically signed in.
                </p>

                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      The link will expire in 24 hours
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Check your spam folder if you don&apos;t see it
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full h-11 font-semibold bg-transparent"
                  variant="outline"
                >
                  <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          Didn&apos;t receive an email?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Try again
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
