import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Whitecarrot Careers | Build Beautiful Careers Pages",
    template: "%s | Whitecarrot Careers",
  },
  description:
    "Create stunning, branded careers pages that attract top talent. Customize your page, showcase your culture, and let candidates discover open roles effortlessly.",
  generator: "Saurabh Dixit",
  keywords: [
    "careers page builder",
    "job board",
    "recruitment software",
    "ATS",
    "hiring platform",
    "careers site builder",
    "employer branding",
    "talent acquisition",
  ],
  authors: [{ name: "Whitecarrot Careers" }],
  creator: "Whitecarrot Careers",
  publisher: "Whitecarrot Careers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Whitecarrot Careers | Build Beautiful Careers Pages",
    description:
      "Create stunning careers pages that attract top talent. Customize, preview, and publish in minutes.",
    siteName: "Whitecarrot Careers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whitecarrot Careers | Build Beautiful Careers Pages",
    description: "Create stunning careers pages that attract top talent.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
