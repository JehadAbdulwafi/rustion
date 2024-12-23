import '../styles/home-page.css';
import { HomePageBackground } from "@/components/gradients/home-page-background";
import { HeroSection } from "@/components/home/hero-section";
import { Pricing } from '@/components/home/pricing/pricing';
import { StatHeading } from '@/components/ui/stat-heading';
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { StartCodingSection } from "@/components/home/start-coding-section";
import { Footer } from '@/components/home/footer';
import { SiteHeader } from '@/components/home/header/site-header';

export default function Home() {
  return (

    <div className="relative flex min-h-svh flex-col">
      <div data-wrapper="" className="border-grid flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <div className="relative">
            <HomePageBackground />
            <HeroSection />
            <Pricing country='US' />
            <div className="container relative mx-auto px-4 py-16 max-w-6xl">
              <StatHeading
                beforeText="Trusted by"
                number="200,000+"
                afterText="Streamers"
              />
              <Testimonials />

              <FAQ />
              <StartCodingSection />
            </div>
            <Footer />
          </div>


        </main>
      </div>
    </div>

  );
}