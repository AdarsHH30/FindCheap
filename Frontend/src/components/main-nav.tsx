"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex w-full justify-between">
      <Link
        href="/"
        className="mr-4 flex items-center gap-2 lg:mr-6"
        prefetch={true}
      >
        {/* TODO:  Add logo here. Better configure logo in the icons component */}
        <Icons.logo />
        <span className="hidden text-2xl font-semibold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/80"
          )}
          prefetch={true}
        >
          Home
        </Link>
        <Link
          href="/find-products"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/find-products") &&
              !pathname?.startsWith("/docs/component/chart")
              ? "text-foreground"
              : "text-foreground/80"
          )}
          prefetch={true}
        >
          Find Products
        </Link>
        <Link
          href="/how-it-works"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/how-it-works")
              ? "text-foreground"
              : "text-foreground/80"
          )}
          prefetch={true}
        >
          How it Works
        </Link>
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/about")
              ? "text-foreground"
              : "text-foreground/80"
          )}
          prefetch={true}
        >
          About
        </Link>
      </nav>
    </div>
  );
}
