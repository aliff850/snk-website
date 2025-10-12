import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
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

export default function MotorPalPage() {
    return(
        <div className="min-h-svh bg-brand-element/10">
            <ProductHero
                title="SNK MyMotorPal"
                caption="A one stop solution app for motor vehicle services, information and products"
            />

            <ProductOverview
                title="What is MyMotorPal"
                overview="
                SNK MyMotorPal is a next-generation mobile app designed to simplify motor ownership and insurance management for everyday drivers. Built for convenience and reliability, the app connects users to essential motor services, real-time assistance, and vehicle information through one seamless platform. Whether it’s handling insurance claims, locating workshops, or getting emergency help, MyMotorPal delivers fast, reliable solutions right from your phone.
                <br><br>
                Available on both Apple and Android devices, MyMotorPal is integrated with SNKMDR’s Road Ranger CRM system and call center, ensuring users have immediate access to support and trusted service providers. With intelligent automation and smart notifications, the app keeps you informed, protected, and in control — wherever the road takes you.
                "
                alt="AllClaims Landing Page"
                galleryImages={[
                    { src: '/services/motorpal/motorpal3.png', alt: 'Logo'},
                    { src: '/services/motorpal/motorpal1.png', alt: 'UI' },
                    { src: '/services/motorpal/motorpal2.png', alt: 'UI 2' },
                    
                ]}
            />

            <ProductFeatures 
                header="Key Features in MyMotorPal"
                caption="Stay connected, protected, and in control with smart tools designed to make every drive worry-free."
                features={motorPalFeatures}
            />

            {/* <PreviewVideo 
                filename='https://www.youtube.com/embed/wXlRf90vHIw?si=Q-ExL2lnoVaEUGzj'
            /> */}
            
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
