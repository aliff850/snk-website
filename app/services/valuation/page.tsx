import { ProductHero } from '@/app/components/services/products/hero';
// import { ProductOverview } from '@/app/components/services/products/overview';
import { ProductOverviewAlt } from '@/app/components/services/products/overviewAlt';
import { ProductFeatures } from '@/app/components/services/products/features';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/video';

export default function ValuationPage() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40">
            <ProductHero
                title="SNK Real-Time Valuation Enquiry"
                caption="Online real-time enquiry for motor vehicle valuation."
            />

            <ProductOverviewAlt
                overview="
                The SNK Real-Time Online Enquiry Platform is a comprehensive vehicle valuation solution designed to provide instant, reliable, and up-to-date information for a wide range of vehicles. With a database of over 22,322 vehicle valuations spanning 52 makes and models from 1990 to the present, it ensures users have access to accurate market values at their fingertips. The platform covers more than 15 major makes and models, representing about 80% of vehicles on the road, making it an essential tool for automotive professionals, insurers, dealers, and individuals alike.
                <br><br>
                Beyond private cars, the platform extends to specialized categories, offering 4,381 valuations for major private vehicles and over 6,000 valuations for lorries, including various makes, models, years, and body types. With its real-time enquiry feature, users can instantly obtain the latest market valuations, reducing guesswork and supporting better decision-making in sales, purchases, and insurance assessments. The platform’s ease of use, speed, and comprehensive coverage make it a reliable solution for anyone needing accurate vehicle valuation data.
                "
                alt="AllClaims Landing Page"
                galleryImages={[
                    { src: '/services/cols/allclaims.png', alt: 'AllClaims dashboard' },
                    { src: '/services/cols/allclaims2.png', alt: 'Accident intake' },
                    { src: '/services/cols/cols.png', alt: 'Logo'}
                ]}
            />

            <ProductFeatures 
                header="Features"
                caption=""
            />

            <PreviewVideo 
                filename='https://www.youtube.com/embed/wXlRf90vHIw?si=Q-ExL2lnoVaEUGzj'
            />
            
            {/* <AllClaimsHowItWorks /> */}
            <ProductCTA 

                title="Transform your valuation process today"
                caption="Get instant real-time vehicle valuation through inquiries today"
                button="Try The Real-Time Inquiry Platform"
                target="_blank"
                link="/valuation"
            
            />
        </div>
    )
}
