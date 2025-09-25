import { AllClaimsHero } from '@/components/services/allclaims/hero';
import { AllClaimsOverview } from '@/components/services/allclaims/overview';
import { AllClaimsFeatures } from '@/components/services/allclaims/features';
import { AllClaimsHowItWorks } from '@/components/services/allclaims/howItWorks';
import { AllClaimsCTA } from '@/components/services/allclaims/cta';
import { PreviewVideo } from '@/app/components/services/allclaims/video';

export default function AllClaimsPage() {
    return(
        <div className="min-h-screen">
            <AllClaimsHero />
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
