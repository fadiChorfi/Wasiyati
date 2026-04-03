import AboutSection from "@/components/landing/AboutSection";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";
import ServicesSection from "@/components/landing/ServicesSection";
import AboutWillBanner from "@/components/landing/AboutWillBanner";
import ContactUsBanner from "@/components/landing/ContactUsBanner";

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-3 flex flex-col">
      <div className="top-2 left-0 right-0 w-full z-50 sticky">
        <Navbar />
      </div>
      <div className="mx-auto w-full space-y-0">
        <HeroSection />
        <AboutSection />
        <AboutWillBanner /> 
        <ServicesSection />
        <ContactUsBanner />
      </div>
    </main>
  );
}
