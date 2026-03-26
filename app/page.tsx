import AboutSection from "@/components/landing/AboutSection";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-3">
      <div className="mx-auto max-w-350 space-y-0">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
      </div>
    </main>
  );
}
