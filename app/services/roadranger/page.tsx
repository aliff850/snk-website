import { ProductHero } from '@/app/components/services/products/hero';
import { ProductOverview } from '@/app/components/services/products/overview';
import { ProductFeatures } from '@/app/components/services/products/features';
import { ProductCTA } from '@/app/components/services/products/cta';
import { PreviewVideo } from '@/app/components/services/products/previewVideo';

export const metadata = {
    title: "Road Ranger",
};

const roadRangerFeatures = [
    {
        title: "Multi-Channel Connectivity",
        description: "Seamlessly connects to customers through multiple channels — including the MyMotorPal app, phone, web app, SMS, and WhatsApp — ensuring instant accessibility and support."
    },
    {
        title: "Live Tow Truck Tracking",
        description: "Integrated GPS tracking allows call center agents to locate and dispatch the nearest available tow truck in real time, reducing response times and improving customer satisfaction."
    },
    {
        title: "Full Ecosystem Integration",
        description: "Links the call center with insurers, workshops, and the AllClaims BI system — ensuring that every accident record flows automatically from initial report to claim resolution."
    },
    {
        title: "Centralized Job Allocation",
        description: "Provides a unified platform for managing towing, repair, and claims tasks, with smart job distribution based on proximity, workload, and service availability."
    },
    {
        title: "Insurer Collaboration Platform",
        description: "Designed for insurer integration — enabling companies without the MyMotorPal app to utilize the same CRM and communication channels for seamless claim management."
    },
    {
        title: "Industry-Driven, Connected Infrastructure",
        description: "Built as a centralized, industry-supported solution that benefits both customers and insurers by improving transparency, reducing duplication, and enhancing service reliability."
    }
];

export default function RoadRangerPage() {
    return (
        <div className="min-h-svh bg-brand-bg">
            <ProductHero
                title="SNK Road Ranger"
                caption="A Call Center CRM System That Connects Accident Incident To Call Centre"
            />

            <ProductOverview
                title="What is Road Ranger?"
                overview="
                SNK Road Ranger is a powerful Call Center CRM system that bridges every element of the motor claims ecosystem — from roadside assistance to final claims settlement. Designed to enhance efficiency, transparency, and communication, it connects drivers, insurers, workshops, and tow truck operators through a single integrated platform.
                <br><br>
                At the core of the system is real-time coordination between the SNKMDR call center, MyMotorPal mobile app, and AllClaims BI. Whether a customer reaches out via mobile app, phone call, SMS, or WhatsApp, Road Ranger ensures every incident is captured, tracked, and resolved efficiently — providing a unified experience for all parties involved.
                "
                alt="Road Ranger Interface"
                galleryImages={[
                    { src: '/services/roadranger/ranger.png', alt: 'Main' },
                    { src: '/services/roadranger/ranger1.png', alt: 'UI 1' },
                    { src: '/services/roadranger/ranger2.png', alt: 'UI 2' },
                ]}
            />

            <ProductFeatures
                header="Key Features in Road Ranger"
                caption="The all-in-one CRM solution that keeps the motor claims ecosystem moving."
                features={roadRangerFeatures}
            />

            <PreviewVideo
                filename='https://www.youtube.com/embed/dkQbyEnM8cg?si=YApSJVnBNzMcoq9E'
            />

            <ProductCTA

                title="Experience the Power of Road Ranger"
                caption="Transform how your organization manages motor claims and roadside incidents with SNK Road Ranger."
                button="Contact Us For A Free Demo"
                target=""
                link="/contact"

            />
        </div>
    )
}
