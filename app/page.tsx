import AboutSection from "@/components/landing/AboutSection";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-3 flex flex-col">
      <div className="mx-auto w-full space-y-0">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
      </div>
      <div className="mx-auto w-full mt-auto">
        <Footer />
      </div>
    </main>
  );
}
