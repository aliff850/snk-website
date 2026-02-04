import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import Image from 'next/image'
import SectionContainer from '@/components/ui/SectionContainer'

// Timeline data structure
interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    image: string;
    isLeft?: boolean; // For alternating layout
}

const timelineEvents: TimelineEvent[] = [
    {
        year: "2002",
        title: "The Beginning",
        description: "Founded as SNK Holdings, offering motor vehicle valuations to MBA Insurance. Launched the first real-time web-based vehicle valuation platform, covering 80% of private cars.",
        image: "/images/timeline/beginning.png"
    },
    {
        year: "2008",
        title: "Becoming SNK MDR",
        description: "Rebranded as SNK MDR, a dedicated Insurtech provider. Accredited by the Motor Research Consortium; approved by BNM & PIAM to deliver accident estimation systems.",
        image: "/images/timeline/snknew.png"
    },
    {
        year: "2014",
        title: "Expanding Horizons",
        description: "Registered with MDEC for motor claims solutions. Formed SNKMDR India to expand regional Insurtech services.",
        image: "/images/timeline/expand.png"
    },
    {
        year: "2016",
        title: "Advanced Solutions",
        description: "Extended valuation services to six Malaysian insurers and one in Thailand. First to provide valuations for lorries (up to 10 tonnes) and motorcycles.",
        image: "/images/timeline/10tons.png"
    },
    {
        year: "2018",
        title: "Road Ranger Thailand",
        description: "Developed and launched Road Ranger for Thailand's insurers, covering accident assistance, vehicle damage estimation, adjusting, and repair payments.",
        image: "/images/timeline/roadrangerthailand.png"
    },
    {
        year: "2022",
        title: "Online Insurance Sales and Marketing Platform",
        description: "Launched an integrated online platform enabling insurers and agents to manage digital policy sales, marketing campaigns, and customer engagement in real time.",
        image: "/services/insurance/digital-insurance.png"
    },
    {
        year: "2024",
        title: "Comprehensive Insurance Loss Adjuster Online System",
        description: "Introduced a unified system for loss adjusters to streamline claims assessment, documentation, and reporting, enhancing efficiency and transparency across insurers.",
        image: "/images/timeline/loss.png"
    },
    {
        year: "2025",
        title: "Service Tax Middleware Services",
        description: "Deployed a specialized middleware solution for automated service tax compliance, connecting insurers’ core systems with regulatory reporting frameworks seamlessly.",
        image: "/images/timeline/middleware.png"
    },

];

export function History() {
    return (
        <SectionContainer variant="brand-bg">
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">

                <AnimateOnLoad animation="fade-in-up">
                    <div className="flex flex-col text-center gap-2 md:gap-4 max-w-4xl">
                        <h1 className="text-brand text-3xl md:text-4xl font-bold">Our Journey</h1>
                        <p className="text-brand text-base">
                            Over 25 years of innovation, growth, and transformation in the insurtech industry.
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* Timeline Container */}
                <div className="w-full max-w-7xl mx-auto">
                    <AnimateOnLoad animation="fade-in-up" delay={200}>
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-brand rounded-full"></div>

                            {/* Timeline Events */}
                            <div className="flex flex-col gap-4 md:gap-8">
                                {timelineEvents.map((event, index) => (
                                    <TimelineEventComponent
                                        key={index}
                                        event={event}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </AnimateOnLoad>
                </div>
            </div>
        </SectionContainer>
    )
}

interface TimelineEventProps {
    event: TimelineEvent;
    index: number;
}

function TimelineEventComponent({ event, index }: TimelineEventProps) {
    const isLeft = index % 2 === 0;
    const animationDelay = (index * 100) as 0 | 100 | 200 | 300 | 400;

    return (

        <div className={`w-full grid items-center gap-4 sm:grid-cols-1 md:grid-cols-[5fr_1fr_5fr]`}>

            {/* Content Card */}
            <div className={`${isLeft ? 'md:text-right md:pr-4' : 'md:text-left md:pl-4'} order-1 ${isLeft ? 'md:order-1' : 'md:order-3'}`}>
                <AnimateOnLoad
                    animation={isLeft ? "fade-in-left" : "fade-in-right"}
                    delay={animationDelay}
                >
                    <div className="bg-brand-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 ring-1 ring-brand/20 hover:bg-brand-white hover:ring-brand transition-all duration-500 ease-in-out shadow-lg flex flex-col gap-1 md:gap-2">
                        <div className="text-brand text-3xl font-bold">{event.year}</div>
                        <h3 className="text-brand text-lg md:text-xl font-semibold">{event.title}</h3>
                        <p className="text-brand text-sm md:text-base leading-relaxed">{event.description}</p>
                    </div>
                </AnimateOnLoad>
            </div>

            {/* Node */}
            <div className="hidden md:flex mx-8 justify-center md:order-2">
                <div className="relative">
                    <div className="w-6 h-6 bg-brand rounded-full border-4 border-white shadow-lg z-10 relative"></div>
                    {/* Node Glow Effect */}
                    <div className="absolute inset-0 w-6 h-6 bg-brand-element rounded-full opacity-50"></div>
                </div>
            </div>


            {/* Image */}
            <div className={`${isLeft ? 'md:pl-4' : 'md:pr-4'} order-2 ${isLeft ? 'md:order-3' : 'md:order-1'}`}>
                <AnimateOnLoad
                    animation={isLeft ? "fade-in-left" : "fade-in-right"}
                    delay={animationDelay}
                >
                    <div className="relative h-64 rounded-2xl ring-1 ring-brand/20 hover:ring-brand transition-all duration-500 overflow-hidden shadow-lg group">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        />
                        {/* Overlay for better visual appeal */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent"></div>
                    </div>
                </AnimateOnLoad>
            </div>
        </div>

    );
}