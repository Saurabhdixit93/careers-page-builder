"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Palette,
  Zap,
  BarChart3,
  ArrowRight,
  Sparkles,
  Globe,
  Smartphone,
  Search,
  CheckCircle2,
  Play,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  fadeIn,
  slideInFromLeft,
  slideInFromRight,
  cardHover,
} from "@/lib/animations";
import { useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

const features = [
  {
    icon: Palette,
    title: "Full Brand Control",
    description:
      "Customize colors, logos, banners, and content sections to match your brand identity perfectly.",
  },
  {
    icon: Briefcase,
    title: "Smart Job Management",
    description:
      "Create, edit, and manage job postings with filters, search, and reusable templates.",
  },
  {
    icon: BarChart3,
    title: "Built-in Analytics",
    description:
      "Track page views, job performance, and candidate engagement to optimize hiring.",
  },
  {
    icon: Zap,
    title: "Live Preview",
    description:
      "See changes in real-time before publishing. Perfect your page with confidence.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Responsive layouts ensure candidates have a smooth experience on any device.",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description:
      "Built-in SEO best practices help candidates discover your jobs through search engines.",
  },
];

const benefits = [
  "Unlimited careers pages",
  "Custom branding & colors",
  "Drag-and-drop sections",
  "Job filtering & search",
  "Mobile responsive",
  "SEO optimized",
  "Analytics dashboard",
  "Team collaboration",
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Demo", href: "/demo/techcorp/careers" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 gradient-mesh opacity-50" />
      <div className="fixed inset-0 -z-10 dot-pattern opacity-30" />

      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/50 glass"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="h-12 w-12 rounded-full"
              />
              <div className="absolute inset-0 h-full w-full" />
            </div>
            <div className="flex flex-col gap-0">
              <h1 className="text-xl font-semibold tracking-tight ">
                Whitecarrot
              </h1>
              <h3 className="text-sm text-muted-foreground font-semibold tracking-tight">
                Build your future
              </h3>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex hover:text-white"
            >
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl space-y-8 text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeIn} className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Built for modern recruiting teams
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-balance text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
            >
              Build careers pages that{" "}
              <span className="text-gradient">Candidates love</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-balance text-lg text-muted-foreground md:text-xl"
            >
              Create stunning, branded careers pages in minutes. Showcase your
              culture, manage jobs, and track analytics — all in one powerful
              platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
            >
              <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                <Link href="/auth/sign-up">
                  Start Building Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full gap-2 sm:w-auto bg-transparent"
              >
                <Link href="/demo/techcorp/careers">
                  <Play className="h-4 w-4" />
                  View Live Demo
                </Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center gap-4 pt-8"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-primary/40"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <span>Trusted by 500+ recruiting teams</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero visual decoration */}
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to attract top talent
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help recruiters build compelling
              careers pages and provide candidates with a seamless browsing
              experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover="hover"
                initial="rest"
              >
                <motion.div
                  variants={cardHover}
                  className="group h-full rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="border-t border-border/50 bg-muted/30 py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in three simple steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Build your careers page in minutes, not days. No coding required.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your page",
                description:
                  "Sign up and create your first careers page with your company details.",
                icon: Globe,
              },
              {
                step: "02",
                title: "Customize & brand",
                description:
                  "Add your logo, colors, content sections, and job listings.",
                icon: Palette,
              },
              {
                step: "03",
                title: "Publish & share",
                description:
                  "Preview your page, hit publish, and share it with the world.",
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < 2 && (
                  <div className="absolute right-0 top-12 hidden h-px w-full bg-gradient-to-r from-border to-transparent lg:block" />
                )}
                <div className="relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-4xl font-bold text-primary/20">
                      {item.step}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={slideInFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for recruiters who care about candidate experience
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop using generic job boards. Create a careers page that
                reflects your company culture and makes it easy for candidates
                to find their dream role.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/auth/sign-up">
                    Start Building
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={slideInFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-2xl">
                <div className="h-8 border-b border-border/50 bg-muted/50 px-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <div className="h-3 w-3 rounded-full bg-warning/50" />
                  <div className="h-3 w-3 rounded-full bg-success/50" />
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-8 w-32 rounded-lg bg-primary/20" />
                    <div className="h-4 w-48 rounded bg-muted" />
                    <div className="h-4 w-40 rounded bg-muted" />
                    <div className="mt-6 grid gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-3"
                        >
                          <div className="h-10 w-10 rounded-lg bg-primary/20" />
                          <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-muted" />
                            <div className="h-2 w-16 rounded bg-muted/50" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 text-center md:p-12">
              {/* Background decoration */}
              <div className="absolute inset-0 grid-pattern opacity-30" />

              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to transform your hiring?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                  Join innovative companies building careers pages that stand
                  out. Start free, upgrade as you grow.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                    <Link href="/auth/sign-up">
                      Create Your Careers Page
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <Link href="/demo/techcorp/careers">View Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="h-12 w-12 rounded-full"
                />
                <div className="absolute inset-0 h-full w-full" />
              </div>
              <div className="flex flex-col gap-0">
                <h1 className="text-xl font-semibold tracking-tight ">
                  Whitecarrot
                </h1>
                <h3 className="text-sm text-muted-foreground font-semibold tracking-tight">
                  Build your future
                </h3>
              </div>
            </Link>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {navLinks.map((link, index) => (
                <Link
                  href={link.href}
                  key={index}
                  className="transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Whitecarrot Careers. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
