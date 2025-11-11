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
      <section id="demo" className="scroll-mt-24">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                See FindCheap in Action
                <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Product Demo
                </span>
              </h1>
            </>
          }
        >
          <video
            src="/demo.mp4"
            className="mx-auto h-full w-full rounded-2xl object-cover"
            height={720}
            width={1400}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        </ContainerScroll>
      </section>
      {/* <StatsSection /> */}
      {/* <MacbookScroll /> */}
      {/* <HowItWorks /> */}
      <Testimonials />
      <FAQ />
      <Footer01Page />
    </main>
  );
}
