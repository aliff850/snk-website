import { AllClaimsHero } from '@/components/services/allclaims/hero';
import { AllClaimsOverview } from '@/components/services/allclaims/overview';
import { AllClaimsFeatures } from '@/components/services/allclaims/features';
import { AllClaimsHowItWorks } from '@/components/services/allclaims/howItWorks';
import { AllClaimsCTA } from '@/components/services/allclaims/cta';
import { PreviewVideo } from '@/app/components/services/allclaims/video';

export default function AllClaimsPage() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40">
            <AllClaimsHero
                title="AllClaims"
                caption="EPIC ESTIMATION SYSTEM"
            />
            <AllClaimsOverview />
            <AllClaimsFeatures />
            <PreviewVideo 
                filename='Auto estimation.mp4'
            />
            
            {/* <AllClaimsHowItWorks /> */}
            <AllClaimsCTA />
        </div>
    )
}
