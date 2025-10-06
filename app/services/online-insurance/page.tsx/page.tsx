import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverviewAlt } from '@/app/components/services/products/overviewAlt';
import { ProductFeatures } from '@/app/components/services/products/features';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/video';

const motorPalFeatures = [
    {
        title: "Smart Claims & Assistance",
        description: "Get instant roadside assistance and connect directly to SNKMDR’s call center or your insurer’s support team for help when you need it most."
    },
    {
        title: "AI Damage Estimation",
        description: "Use AI-powered image analysis to estimate repair costs and generate on-demand adjuster reports within minutes."
    },
    {
        title: "Vehicle Valuation & Insurance Insights",
        description: "Receive accurate car market valuations and coverage updates to prevent over- or under-insurance."
    },
    {
        title: "Workshop & Service Locator",
        description: "Find nearby authorized or third-party workshops, tyre, battery, and accessory providers — all verified and accessible in-app."
    },
    {
        title: "Renewal Reminders",
        description: "Never miss an insurance renewal or payment deadline with automated notifications and reminders."
    },
    {
        title: "Emergency GPS Assistance",
        description: "Activate GPS-based emergency help for towing or accidents, connected to a network of over 1,000 tow truck operators."
    }
];

export default function AllClaimsPage() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40">
            <ProductHero
                title="Online Digital Insurance Platform"
                caption="Buy insurance the smart way — quick, simple, and fully online"
            />

            <ProductOverviewAlt
                overview="
                SNK MyMotorPal is a next-generation mobile app designed to simplify motor ownership and insurance management for everyday drivers. Built for convenience and reliability, the app connects users to essential motor services, real-time assistance, and vehicle information through one seamless platform. Whether it’s handling insurance claims, locating workshops, or getting emergency help, MyMotorPal delivers fast, reliable solutions right from your phone.
                <br><br>
                Available on both Apple and Android devices, MyMotorPal is integrated with SNKMDR’s Road Ranger CRM system and call center, ensuring users have immediate access to support and trusted service providers. With intelligent automation and smart notifications, the app keeps you informed, protected, and in control — wherever the road takes you.
                "
                alt="AllClaims Landing Page"
                galleryImages={[
                    { src: '/services/cols/allclaims.png', alt: 'AllClaims dashboard' },
                    { src: '/services/cols/allclaims2.png', alt: 'Accident intake' },
                    { src: '/services/cols/cols.png', alt: 'Logo'}
                ]}
            />

            <ProductFeatures 
                header="Explore its Features"
                caption="Built to make buying insurance simpler, faster, and better."
                features={motorPalFeatures}
            />

            <PreviewVideo 
                filename='https://www.youtube.com/embed/wXlRf90vHIw?si=Q-ExL2lnoVaEUGzj'
            />
            
            <ProductCTA 

                title="Drive smarter. Stay protected. Be in control."
                caption="Download the SNK MyMotorPal and experience the future of motor services in one powerful app."
                button="Contact us today for a free demo"
                target=""
                link="/contact"
            
            />
        </div>
    )
}
