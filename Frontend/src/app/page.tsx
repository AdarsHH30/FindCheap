import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer01Page from "@/components/Footer/footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      {/* <StatsSection /> */}
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer01Page />
    </main>
  );
}
