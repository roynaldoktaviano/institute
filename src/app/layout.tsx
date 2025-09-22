import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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
  title: "Doran Insititute - Learning Management System",
  description: "Professional drone training and certification platform. Learn drone mapping, photography, safety regulations, and more.",
  keywords: ["Drone", "LMS", "Training", "Academy", "Certification", "Photography", "Mapping"],
  authors: [{ name: "Doran Institute" }],
  openGraph: {
    title: "Doran Insititute",
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

export default function RootLayout({
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
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
