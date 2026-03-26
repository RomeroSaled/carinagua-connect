import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import TabNavigation from "@/components/TabNavigation";
import InformacionGeneral from "@/components/InformacionGeneral";
import ResidentePanel from "@/components/ResidentePanel";
import RepresentantePanel from "@/components/RepresentantePanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("info");

  const handleBack = () => {
    setActiveTab("info");
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {activeTab === "info" && <InformacionGeneral />}
        {activeTab === "residente" && <ResidentePanel onBack={handleBack} />}
        {activeTab === "representante" && <RepresentantePanel onBack={handleBack} />}
      </main>
    </div>
  );
};

export default Index;
