import SmoothScroll from "@/components/chrome/SmoothScroll";
import Navbar from "@/components/chrome/Navbar";
import CustomCursor from "@/components/chrome/CustomCursor";
import HeroWhoWeAreSection from "@/components/sections/HeroWhoWeAreSection";
import SustainabilitySection from "@/components/sections/SustainabilitySection";
import ServicesFlowerSection from "@/components/sections/ServicesFlowerSection";
import DiscoverWordsSection from "@/components/sections/DiscoverWordsSection";
import FactsUpcyclingSection from "@/components/sections/FactsUpcyclingSection";
import PhenomenonHorizontalSection from "@/components/sections/PhenomenonHorizontalSection";
import ApproachWaveSection from "@/components/sections/ApproachWaveSection";
import ClientApproachSection from "@/components/sections/ClientApproachSection";
import ImpactFoundersSection from "@/components/sections/ImpactFoundersSection";
import WhoWeBuildWithSection from "@/components/sections/WhoWeBuildWithSection";
import FeaturedWorkSection from "@/components/sections/FeaturedWorkSection";
import SelectedEcosystemSection from "@/components/sections/SelectedEcosystemSection";
import InsightsContactFooter from "@/components/sections/InsightsContactFooter";

export default function HomePage() {
  return (
    <SmoothScroll>
      <Navbar />
      <CustomCursor />
      <main>
        <HeroWhoWeAreSection />
        <SustainabilitySection />
        <ServicesFlowerSection />
        <DiscoverWordsSection />
        <FactsUpcyclingSection />
        <PhenomenonHorizontalSection />
        <ApproachWaveSection />
        <ClientApproachSection />
        <ImpactFoundersSection />
        <WhoWeBuildWithSection />
        <FeaturedWorkSection />
        <SelectedEcosystemSection />
        <InsightsContactFooter />
      </main>
    </SmoothScroll>
  );
}
