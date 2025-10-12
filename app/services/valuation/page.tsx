import { ProductHero } from "@/app/components/services/products/hero";
import { ProductOverview } from '@/app/components/services/products/overview';
// import { ProductOverviewAlt } from "@/app/components/services/products/overviewAlt";
import { ProductFeatures } from "@/app/components/services/products/features";
import { ProductCTA } from "@/app/components/services/products/cta";
import { PreviewVideo } from "@/app/components/services/products/video";

const valuationFeatures = [
  {
    title: "Real-Time Market Valuations",
    description:
      "Get instant, up-to-date vehicle valuations right at your fingertips.",
  },
  {
    title: "Coverage of Popular Models",
    description:
      "Covers 15+ major makes representing 80% of vehicles on the road.",
  },
  {
    title: "Specialized Vehicle Categories",
    description:
      "Includes valuations for private cars, lorries, and various other body types.",
  },
  {
    title: "Accurate Market Insights",
    description:
      "Reliable data that can be used to support sales, purchases, and insurance assessments.",
  },
  {
    title: "User-Friendly Interface",
    description: "Simple and intuitive platform for quick valuation enquiries.",
  },
  {
    title:"Condition-Based Valuation",
    description: "Adjust your vehicle’s value based on its origin, mileage, and previous insured sum for a more accurate estimate."
  }
];

export default function ValuationPage() {
  return (
    <div className="min-h-svh bg-brand-element/10">
      <ProductHero
        title="SNK Real-Time Valuation Enquiry"
        caption="Online real-time enquiry for motor vehicle valuation"
        backgroundImage="/services/value.jpg"
      />

      <ProductOverview
        title="What is SNK Real-Time Valuation Inquiry?"
        overview="
                The SNK Real-Time Online Enquiry Platform is a comprehensive vehicle valuation solution designed to provide instant, reliable, and up-to-date information for a wide range of vehicles. With a database of over 22,322 vehicle valuations spanning 52 makes and models from 1990 to the present, it ensures users have access to accurate market values at their fingertips. The platform covers more than 15 major makes and models, representing about 80% of vehicles on the road, making it an essential tool for automotive professionals, insurers, dealers, and individuals alike.
                <br><br>
                Beyond private cars, the platform extends to specialized categories, offering 4,381 valuations for major private vehicles and over 6,000 valuations for lorries, including various makes, models, years, and body types. With its real-time enquiry feature, users can instantly obtain the latest market valuations, reducing guesswork and supporting better decision-making in sales, purchases, and insurance assessments. The platform’s ease of use, speed, and comprehensive coverage make it a reliable solution for anyone needing accurate vehicle valuation data.
                "
        alt="Valuation Images"
        galleryImages={[
          { src: "/services/valuation/val1.jpg", alt: "valuation1" },
          { src: "/services/valuation/val2.jpg", alt: "valuation2" },
          { src: "/services/valuation/val3.png", alt: "valuation3" },
          { src: "/services/valuation/val4.png", alt: "valuation4" },
        ]}
      />

      <ProductFeatures
        header="Features"
        caption="Explore the many features of SNK's Vehicle Valuation Inquiry Platform"
        features={valuationFeatures}
      />

      {/* <PreviewVideo filename="https://www.youtube.com/embed/wXlRf90vHIw?si=Q-ExL2lnoVaEUGzj" /> */}

      {/* <ProductCTA
        title="Transform your valuation process today"
        caption="Get instant real-time vehicle valuation through inquiries today"
        button="Try Now"
        target="_blank"
        link="/valuation"
      /> */}
    </div>
  );
}
