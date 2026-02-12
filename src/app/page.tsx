import HomeSection from "../components/landingpage/HomeSection";
import FeaturesSection from "../components/landingpage/FeaturesSection";
import IntegrationsSection from "../components/landingpage/IntegrationSection";
import ServicesSection from "../components/landingpage/ServicesSection";
import ClosingSection from "../components/landingpage/ClosingSection";
import { Navbar } from "../components/landingpage/HomeSection";

export default function Home() {
  return (
    <main className="w-screen min-h-screen bg-black font-leniamono">
      <Navbar />

      {/* HomeSection with integrated fade */}
      <div className="relative">
        <HomeSection />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/50 to-black z-20 pointer-events-none" />
      </div>

      {/* FeaturesSection with integrated fade */}
      <div className="relative">
        <FeaturesSection />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/50 to-black z-20 pointer-events-none" />
      </div>

      {/* IntegrationsSection with integrated fade */}
      <div className="relative">
        <IntegrationsSection />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-black/50 to-black z-20 pointer-events-none" />
      </div>

      {/* ServicesSection with integrated fade */}
      <div className="relative">
        <ServicesSection />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-black/60 to-black z-20 pointer-events-none" />
      </div>

      {/* ClosingSection - last section */}
      <ClosingSection />
    </main>
  );
}