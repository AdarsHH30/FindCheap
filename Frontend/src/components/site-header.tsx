"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import LoginComponent from "./LoginComponent";

const SiteHeader = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-14 md:pt-16 md:pb-8 md:px-10 items-center gap-2 md:gap-4 ">
        <MainNav />
        <MobileNav />
        <div className="ml-auto flex items-center md:flex-1 md:justify-end">
          <nav className="flex items-center gap-4">
            <LoginComponent user={user} setUser={setUser} />
            <ModeSwitcher />
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default SiteHeader;
