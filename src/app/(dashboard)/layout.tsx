import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import ClientWrapper from "@/components/lms/ClientWrapper";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doran Institute - Learning Management System",
  description:
    "Professional drone training and certification platform. Learn drone mapping, photography, safety regulations, and more.",
  keywords: ["Drone", "LMS", "Training", "Academy", "Certification", "Photography", "Mapping"],
  authors: [{ name: "Doran Institute" }],
  openGraph: {
    title: "Doran Institute",
    description: "Professional drone training and certification platform",
    url: "https://doranistitute.com",
    siteName: "Doran Institute",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doran Institute",
    description: "Professional drone training and certification platform",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
        <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
