import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer01Page from "@/components/Footer/footer";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Find the Right Deal At
              <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Find Cheap
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>{" "}
      {/* <StatsSection /> */}
      {/* <MacbookScroll /> */}
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer01Page />
    </main>
  );
}
