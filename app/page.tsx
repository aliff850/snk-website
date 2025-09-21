"use client"

import { HeroSection } from "./components/home/hero";
import { Background } from "./components/home/background";
import { ReasonSection } from "./components/home/reasons";
import { SolutionsSection } from "./components/home/solutions";
import { ClientSection } from "./components/home/clients";
import ClientCarousel from "./components/home/clients-alt";
import { useEffect } from "react";
import { FAQSection } from "./components/home/faq";

export default function Home() {

  useEffect(() => {
    // Force scroll to top on mount (when page loads/reloads)
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      
      <HeroSection/>
      <Background/>
      <ReasonSection/>
      <SolutionsSection/>
      <ClientCarousel/>
      <FAQSection/>
      {/* <ClientSectionNew/> */}
    </div>
  );
}
