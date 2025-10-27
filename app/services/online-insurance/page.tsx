import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
import { ProductFeatures } from '@/app/components/services/products/features';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/previewVideo';

export const metadata = {
    title: "Online Digital Insurance Platform",
};

const motorPalFeatures = [
    {
        title: "End-to-End Digital Insurance Journey",
        description: "Customers can browse, compare, purchase, and receive their insurance policies entirely online — from quotation to issuance, with no paperwork or physical signatures required"
    },
    {
        title: "B2B and B2C Ready",
        description: "Designed for both business and consumer markets, the platform allows insurance agents and brokers to manage their portfolios, onboard clients, and sell policies efficiently"
    },
    {
        title: "Secure Online Payments & Instant Policy Issuance",
        description: "Integrated with major payment gateways for real-time transactions and automatic policy generation — ensuring customers receive their digital policy documents instantly"
    },
    {
        title: "Agent Management Dashboard",
        description: "Empowers insurance agents with powerful tools for lead tracking, sales monitoring, commission management, and real-time performance analytics"
    },
    {
        title: "Seamless Integration with Insurer Systems",
        description: "Supports integration with existing insurer databases, CRM, and underwriting systems for live data synchronization, policy updates, and claims tracking"
    },
    {
        title: "Customer Self-Service Portal",
        description: "Provides policyholders with 24/7 access to view policies, renew coverage, make payments, or file claims — all through a user-friendly online dashboard."
    }
];

export default function OnlineInsurancePage() {
    return(
        <div className="min-h-svh bg-brand-element/10">
            <ProductHero
                title="Online Digital Insurance Platform"
                caption="Smart. Secure. Seamless. The Future of Digital Insurance Distribution."
                backgroundImage='/images/g20.jpg'
            />

            <ProductOverview
                title="What is Digital Insurance Platform?"
                overview="
                SNK Online Digital Insurance Platform is a powerful, cloud-based solution designed to modernize the way insurance is bought, sold, and managed. Built for both B2B and B2C markets, the platform connects insurers, agents, and customers through one seamless ecosystem — enabling the complete insurance lifecycle to take place online.
                <br><br>
                From policy selection and premium calculation to secure payment and instant policy issuance, SNK’s platform delivers a fully digital, paperless insurance experience. Whether you’re an insurer looking to expand your digital distribution channels or an agent aiming to reach more customers, SNK empowers you with the tools, insights, and automation needed to thrive in today’s connected world.
                "
                alt="AllClaims Landing Page"
                galleryImages={[
                    { src: '/services/insurance/digital-insurance.png', alt: 'Logo' },

                ]}
            />

            <ProductFeatures 
                header="Explore its Features"
                caption="Built to make buying insurance simpler, faster, and better."
                features={motorPalFeatures}
            />

            <PreviewVideo 
                filename='https://www.youtube.com/embed/dmpKydJSLh8?si=Dafhp02b1n5tFba0'
            />
            
            <ProductCTA 

                title="Experience Digital Insurance, Redefined"
                caption="SNK Online Digital Insurance Platform — built by SNK to deliver a faster, smarter, and more seamless way to buy and manage insurance online"
                button="Contact Us For A Free Demo"
                target=""
                link="/contact"
            
            />
        </div>
    )
}
