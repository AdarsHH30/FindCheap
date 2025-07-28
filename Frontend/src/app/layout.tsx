"use client";
import { useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/auth");

  useEffect(() => {
    fetch("http://localhost:8000/api/csrf/", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to fetch CSRF token");
        }
      })
      .catch((err) => {
        console.error("CSRF fetch error:", err);
      });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased ${
          hideHeader ? "" : "md:px-20"
        }`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!hideHeader && <SiteHeader />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
