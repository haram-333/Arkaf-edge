import SmoothScroll from "@/components/chrome/SmoothScroll";
import Navbar from "@/components/chrome/Navbar";
import CustomCursor from "@/components/chrome/CustomCursor";
import HeroWhoWeAreSection from "@/components/sections/HeroWhoWeAreSection";
import ServicesFlowerSection from "@/components/sections/ServicesFlowerSection";
import PhenomenonHorizontalSection from "@/components/sections/PhenomenonHorizontalSection";
import ApproachWaveSection from "@/components/sections/ApproachWaveSection";
import ImpactFoundersSection from "@/components/sections/ImpactFoundersSection";
import FeaturedWorkSection from "@/components/sections/FeaturedWorkSection";
import InsightsContactFooter from "@/components/sections/InsightsContactFooter";

export default function HomePage() {
  return (
    <SmoothScroll>
      <Navbar />
      <CustomCursor />
      <main>
        <HeroWhoWeAreSection />
        <ServicesFlowerSection />
        <PhenomenonHorizontalSection />
        <ApproachWaveSection />
        <ImpactFoundersSection />
        <FeaturedWorkSection />
        <InsightsContactFooter />
      </main>
    </SmoothScroll>
  );
}
