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
