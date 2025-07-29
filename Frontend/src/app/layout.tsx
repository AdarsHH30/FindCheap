"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import CSRFInit from "@/components/CSRFInit";

const inter = Inter({
  subsets: ["latin"],
});

// Note: metadata export is not supported in client components
// Move this to a separate metadata file if needed

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/auth");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased ${
          hideHeader ? "" : "md:px-20"
        }`}
      >
        <CSRFInit />
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
