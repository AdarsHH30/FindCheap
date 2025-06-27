import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 md:pt-16 md:pb-8 md:px-10 items-center gap-2 md:gap-4 ">
        <MainNav />
        <MobileNav />
        <div className="ml-auto flex items-center md:flex-1 md:justify-end">
          <nav className="flex items-center gap-2">
            {/* TODO: Implement authentication */}
            <Button className="rounded-full">Login</Button>
            <ModeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
