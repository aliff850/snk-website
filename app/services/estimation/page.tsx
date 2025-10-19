import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
import { ProductFeatures } from '@/app/components/services/products/features';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/video';

const estimationFeatures = [
    {
        title: "AI-Driven Estimation Engine",
        description: "Harnesses the power of machine learning and advanced algorithms to deliver rapid, data-backed vehicle damage assessments"
    },
    {
        title: "Integrated Industry Databases",
        description: "Integrated with industry approved vehicle parts price database, ensuring accurate pricing, parts matching, and labour rate calculations"
    },
    {
        title: "Comprehensive Vehicle Analysis",
        description: "Evaluates damage across 8 key body sections of a vehicle, calculating costs based on parts, labour, and materials for each area"
    },
    {
        title: "Massive Image Training Library",
        description: "Backed by over 400,000 real vehicle images across various makes and models — continuously improving AI recognition accuracy"
    },
    {
        title: "High Accuracy with Minimal Variance",
        description: "Provides precise estimations with a ±15% variance range, enhancing consistency and confidence in every claim"
    },
    {
        title: "Automated Claims Processing",
        description: "Accelerates smaller claims (up to RM3,000) through auto-approval workflows, reducing claim exaggeration and administrative load"
    }
];

export default function EstimationPage() {
    return(
        <div className="min-h-svh bg-brand-element/10">
            <ProductHero
                title="Motor Vehicle Accident Estimation"
                caption="Comprehensive damage estimation value for a motor vehicle accident claim"
                backgroundImage='/services/estimation.png'
            />

            <ProductOverview
                title="What is Motor Vehicle Accident Estimation?"
                overview="
                SNK Auto Estimation is an advanced, mobile-based damage estimation system designed to streamline and enhance the motor vehicle claims process. Combining machine learning with expert human input, the platform delivers quick, reliable, and data-driven repair cost estimates — ensuring fairness, transparency, and efficiency for insurers, adjusters, and repairers alike.
                <br><br>
                Built to integrate seamlessly with major motor industry databases, including MRC Parts Database and Thatcham Generic Time, SNK Auto Estimation provides precise cost breakdowns for labour, parts, and miscellaneous expenses. With a growing image library of over 400,000 vehicle models, the system continues to evolve — offering ever-improving accuracy and automation in damage assessment.
                "
                alt="Estimation Logo"
                galleryImages={[
                    { src: '/services/estimation/snkestimation.png', alt: 'Estimation logo' },
                ]}
            />

            <ProductFeatures 
                header="Key Features"
                caption="Smart technology built for speed, precision, and trust."
                features={estimationFeatures}
            />

            <PreviewVideo 
                filename='https://www.youtube.com/embed/EId9-gqNMB4?si=lEyYohGOcyTMANeM'
            />
            
            <ProductCTA 

                title="Empowering insurers, repairers, and adjusters with AI precision."
                caption="Revolutionize your claims process with Motor Vehicle Accident Estimation — the intelligent solution for faster, fairer, and more efficient vehicle damage assessments."
                button="Contact Us For A Free Demo"
                target=""
                link="/contact"
            
            />
        </div>
    )
}
