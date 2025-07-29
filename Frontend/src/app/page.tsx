import HeroSection from "@/components/HeroSection";
import Footer01Page from "@/components/Footer/footer";

export default function Home() {
  return (
    <main className="h-[calc(100vh-var(--navbar-height,57px))]">
      <HeroSection />
      <Footer01Page />
    </main>
  );
}
