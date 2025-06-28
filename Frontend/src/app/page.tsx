import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="h-[calc(100vh-var(--navbar-height,57px))]">
      <HeroSection />
    </main>
  );
}
