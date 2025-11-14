"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import LoginComponent from "./LoginComponent";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";

const SiteHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-2 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/"
            className="flex flex-1 items-center gap-2 text-lg font-semibold"
          >
            <span className="rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              FC
            </span>
            <span>{siteConfig.name}</span>
          </Link>
          <MobileNav />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 md:flex-nowrap md:gap-4">
          <MainNav />
          <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-4">
            <nav className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap sm:gap-4">
              {user ? (
                <LoginComponent user={user} setUser={setUser} />
              ) : (
                <Button
                  className="rounded-full px-4 py-2 text-sm sm:text-base"
                  onClick={handleLoginRedirect}
                >
                  Login
                </Button>
              )}
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default SiteHeader;
