import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
import { AllClaimsFeatures } from '@/app/components/services/products/features';
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
                overview="AllClaims leverages cutting-edge artificial intelligence and computer vision technology to analyze vehicle damage from photos, providing instant, accurate repair estimates that streamline the claims process.
                <br><br>
                Our system processes thousands of damage scenarios, learning from each assessment to continuously improve accuracy and reduce processing time from hours to minutes.
                "
                image="/services/estimation.png"
            />

            <AllClaimsFeatures />

            <PreviewVideo 
                filename='Auto estimation.mp4'
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
