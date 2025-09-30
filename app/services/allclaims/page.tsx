import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
import { ProductFeatures } from '@/app/components/services/products/features';
import { AllClaimsHowItWorks } from '@/app/components/services/products/howItWorks';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/video';

export default function AllClaimsPage() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40">
            <ProductHero
                title="AllClaims"
                caption="Online Motor Insurance Claims Processing and Management Solutions"
            />

            <ProductOverview
                title="What is AllClaims?"
                overview="
                AllClaims is a cloud-based, end-to-end motor insurance claims processing and management platform, accredited by MRC, PIAM, and Bank Negara Malaysia. Designed to cover the entire claims lifecycle — from the point of accident to final settlement — AllClaims connects all stakeholders in the ecosystem, including workshops, adjusters, insurers, legal firms, and regulators. With intelligent automation, real-time data processing, and advanced fraud detection, the system ensures faster, more transparent, and accurate claims handling.
                "
                image="/services/allclaims2.png"
                alt="AllClaims Landing Page"
            />

            <ProductFeatures 
                header="Features in AllClaims"
                caption="AllClaim comes with a variety of features designed to streamline the estimation process."
            />

            <PreviewVideo 
                filename='https://www.youtube.com/embed/wXlRf90vHIw?si=Q-ExL2lnoVaEUGzj'
            />
            
            {/* <AllClaimsHowItWorks /> */}
            <ProductCTA 

                title="Ready to Transform Your Claims Process?"
                caption="Join leading insurance companies who have already revolutionized their damage assessment process with AllClaims."
                button="Try AllClaims Today"
                target="_blank"
                link="https://allclaims.com.my/"
            
            />
        </div>
    )
}
