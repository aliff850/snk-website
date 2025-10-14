"use client"

import { HeroSection } from "./components/home/hero";
import { Background } from "./components/home/background";
import { ReasonSection } from "./components/home/reasons";
import { SolutionsSection } from "./components/home/solutions";
import { ClientSection } from "./components/home/clients";
import { ValuationCTA } from "./components/home/valuation";
import ClientCarousel from "./components/home/clients-alt";
import ScrollToTop from "./components/ui/ScrollToTop";
import { FAQSection } from "./components/home/faq";

export default function Home() {

  return (
    <div className="min-h-svh">      
      <HeroSection/>
      <Background/>
      <ReasonSection/>
      <ValuationCTA/>
      <SolutionsSection/>
      <ClientCarousel/>
      <FAQSection/>
      {/* <ClientSectionNew/> */}
    </div>
  );
}
