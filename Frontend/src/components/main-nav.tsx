"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { motion } from "framer-motion";
import { useState, useEffect, useTransition } from "react";
import { ProgressBar } from "@/components/ProgressBar";

interface MainNavProps {
  isLoading?: boolean;
  showSkeleton?: boolean;
}

export function MainNav({
  isLoading: externalLoading,
  showSkeleton = true,
}: MainNavProps = {}) {
  const pathname = usePathname();
  const [internalLoading, setInternalLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  const isLoading =
    externalLoading !== undefined ? externalLoading : internalLoading;
  const shouldShowSkeleton = showSkeleton && isLoading;

  const handleNavigation = (href: string) => {
    if (pathname === href) return;

    setIsNavigating(true);
    startTransition(() => {
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    });
  };

  const SkeletonItem = ({
    width,
    height = "h-6",
    className = "",
    delay = 0,
    variant = "shimmer",
  }: {
    width: string;
    height?: string;
    className?: string;
    delay?: number;
    variant?: "shimmer" | "pulse";
  }) => (
    <motion.div
      className={`${height} ${width} ${className} relative overflow-hidden rounded-md bg-muted`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {variant === "shimmer" ? (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/40 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        />
      ) : (
        <motion.div
          className="absolute inset-0 bg-muted-foreground/60"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        />
      )}
    </motion.div>
  );

  if (shouldShowSkeleton) {
    return (
      <motion.div
        className="mr-4 hidden md:flex w-full justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo skeleton */}
        <div className="mr-4 flex items-center gap-2 lg:mr-6">
          <SkeletonItem
            width="w-8"
            height="h-8"
            className="rounded-full"
            delay={0}
          />
          <SkeletonItem width="w-32 lg:w-40" height="h-6" delay={0.1} />
        </div>

        <nav className="flex items-center gap-4 text-sm xl:gap-6">
          <SkeletonItem width="w-12" height="h-5" delay={0.2} />
          <SkeletonItem width="w-24" height="h-5" delay={0.3} />
          <SkeletonItem width="w-20" height="h-5" delay={0.4} />
          <SkeletonItem width="w-16" height="h-5" delay={0.5} />
        </nav>
      </motion.div>
    );
  }

  return (
    <>
      <ProgressBar isLoading={isNavigating || isPending} />

      <motion.div
        className="mr-4 hidden md:flex w-full justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/"
            className="mr-4 flex items-center gap-2 lg:mr-6 group"
            prefetch={true}
            onClick={() => handleNavigation("/")}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Icons.logo />
            </motion.div>
            <motion.span
              className="hidden text-2xl font-semibold lg:inline-block group-hover:text-primary transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {siteConfig.name}
            </motion.span>
          </Link>
        </motion.div>
        <motion.nav
          className="flex items-center gap-4 text-sm xl:gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/find-products", label: "Find Products" },
            { href: "/how-it-works", label: "How it Works" },
            { href: "/about", label: "About" },
          ].map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "transition-all duration-200 relative group px-3 py-2 rounded-lg font-medium focus:text-white focus:outline-none",
                    isActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary hover:bg-accent/50"
                  )}
                  prefetch={true}
                >
                  <span className="relative z-10">{item.label}</span>

                  <motion.div
                    className="absolute inset-0 bg-muted/50 rounded-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />

                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-secondary rounded-full"
                      initial={{ scale: 0, x: "-50%" }}
                      animate={{ scale: 1, x: "-50%" }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </motion.div>
    </>
  );
}
