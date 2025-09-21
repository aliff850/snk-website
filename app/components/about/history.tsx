import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import Image from 'next/image';

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
        image: "/images/g70.jpg"
    },
    {
        year: "2008",
        title: "Becoming SNKMDR",
        description: "Rebranded as SNKMDR, a dedicated Insurtech provider. Accredited by the Motor Research Consortium; approved by BNM & PIAM to deliver accident estimation systems.",
        image: "/images/g70.jpg"
    },
    {
        year: "2014",
        title: "Expanding Horizons",
        description: "Registered with MDEC for motor claims solutions. Formed SNKMDR India to expand regional Insurtech services.",
        image: "/images/g70.jpg"
    },
    {
        year: "2016",
        title: "Advanced Solutions",
        description: "Extended valuation services to six Malaysian insurers and one in Thailand. First to provide valuations for lorries (up to 10 tonnes) and motorcycles.",
        image: "/images/g70.jpg"
    },
    {
        year: "2018",
        title: "Road Ranger Thailand",
        description: "Developed and launched Road Ranger for Thailand's insurers, covering accident assistance, estimation, adjusting, and repair payments.",
        image: "/images/g70.jpg"
    },
    {
        year: "Today",
        title: "Regional Insurtech Leader",
        description: "Trusted by Allianz, Etiqa, MSIG, Tokio Marine, Great Eastern, Chubb, and more. Driving AI-powered claims estimation with AIT Thailand.",
        image: "/images/g70.jpg"
    },
    
];

export function History() {
    return(
        <section className="w-full min-h-screen justify-center items-center px-4 md:px-12 lg:px-24 py-16 flex flex-col gap-8 font-onest">
            
            <AnimateOnLoad animation="fade-in-up">
                <div className="flex flex-col text-center gap-4 max-w-4xl mx-auto">
                    <h1 className="text-brand text-4xl md:text-5xl lg:text-6xl font-bold">Our Journey</h1>
                    <p className="text-brand text-lg md:text-xl px-4">
                        Over 20 years of innovation, growth, and transformation in the insurtech industry.
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
                        <div className="space-y-8 md:space-y-12">
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

        </section>
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
        <AnimateOnLoad 
            animation={isLeft ? "fade-in-left" : "fade-in-right"} 
            delay={animationDelay}
        >
            <div className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Content Card */}
                <div className={`w-5/12 ${isLeft ? 'text-right pr-4' : 'text-left pl-4'}`}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-brand/20 hover:bg-white hover:scale-105 transition-all duration-300 ease-in-out shadow-lg">
                        <div className="text-brand text-2xl font-bold mb-2">{event.year}</div>
                        <h3 className="text-brand text-xl md:text-2xl font-semibold mb-3">{event.title}</h3>
                        <p className="text-brand/80 text-sm md:text-base leading-relaxed">{event.description}</p>
                    </div>
                </div>
                
                {/* Timeline Node */}
                <div className="w-2/12 flex justify-center">
                    <div className="relative">
                        <div className="w-6 h-6 bg-brand rounded-full border-4 border-white shadow-lg z-10 relative"></div>
                        {/* Node Glow Effect */}
                        <div className="absolute inset-0 w-6 h-6 bg-brand-element rounded-full animate-pulse opacity-50"></div>
                    </div>
                </div>
                
                {/* Image */}
                <div className={`w-5/12 ${isLeft ? 'pl-4' : 'pr-4'}`}>
                    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        />
                        {/* Overlay for better visual appeal */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-transparent"></div>
                    </div>
                </div>
            </div>
        </AnimateOnLoad>
    );
}