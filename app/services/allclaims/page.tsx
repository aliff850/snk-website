import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
import { ProductFeatures } from '@/app/components/services/products/features';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/video';

const allClaimsFeatures = [
    {
        title: "End-to-End Claims Management",
        description: " Process, investigate, and report within one system."
    },
    {
        title: "Standardized Digital Reporting",
        description: "Predefined templates ensure consistent documentation."
    },
    {
        title: "Fraud Detection & Risk Alerts",
        description: "Flags recurring drivers, vehicles, or suspicious patterns."
    },
    {
        title: "Investigation Tracking",
        description: "Monitor all steps and ensure compliance."
    },
    {
        title: "Panel of Adjusters Integration",
        description: "Centralized collaboration for insurers and adjusters."
    },
    {
        title: "Final Comprehensive Reports",
        description: "Professional reports with key insights and recommendations."
    }
];

export default function AllClaimsPage() {
    return(
        <div className="min-h-svh bg-brand-element/10">
            <ProductHero
                title="COLS Investigation System"
                caption="End-to-end online system for motor vehicle accident investigation platform designed for insurance companies and adjusters."
            />

            <ProductOverview
                title="What is COLS?"
                overview="
                COLS AI is a comprehensive online system that unifies claims processing, handling, and investigation into a single platform. Built for insurance companies, claims handlers, and adjusters, it digitizes and standardizes reporting to improve accuracy, efficiency, and consistency in every investigation.
                <br><br>
                With built-in fraud detection, investigation tracking, and automated reporting, COLS AI ensures that no detail is overlooked. The result is a streamlined investigation process that delivers insurers a complete, professional report with material insights and clear recommendations for every claim.
                "
                alt="AllClaims Landing Page"
                galleryImages={[
                    { src: '/services/cols/allclaims.png', alt: 'AllClaims dashboard' },
                    { src: '/services/cols/allclaims2.png', alt: 'Accident intake' },
                    { src: '/services/cols/cols.png', alt: 'Logo'}
                ]}
            />

            <ProductFeatures 
                header="Key Features in COLS"
                caption="The COLS Investigation System comes with a variety of features designed to streamline the estimation process."
                features={allClaimsFeatures}
            />

            <PreviewVideo 
                filename='https://www.youtube.com/embed/wXlRf90vHIw?si=Q-ExL2lnoVaEUGzj'
            />
            
            <ProductCTA 

                title="Ready to Transform Your Claims Process?"
                caption="Join leading insurance companies who have already revolutionized their damage assessment process with AllClaims."
                button="Request a demo today"
                target=""
                link="/contact"
            
            />
        </div>
    )
}
