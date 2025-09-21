import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface Objective {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const objectives: Objective[] = [
    {
        title: "End-to-End Digital Claims",
        description: "Deliver end-to-end digital claims processing in line with BNM’s vision of full automation.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z"/>
            </svg>
        )
    },
    {
        title: "Data-Driven Decisions",
        description: "Empower insurers and customers with real-time data, valuations, and tools for better decision-making.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
            </svg>
        )
    },
    {
        title: "Seamless Customer Experience",
        description: "Enhance customer experience through roadside assistance, claims support, and easy-to-use digital platforms.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23M19 21H5V3H13V9H19V21Z"/>
            </svg>
        )
    },
    {
        title: "Regional Growth with Integrity",
        description: "Expand regionally while maintaining credibility, innovation, and customer-first values.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8 12C10.2 12 12 10.2 12 8S10.2 4 8 4 4 5.8 4 8 5.8 12 8 12M8 14C3.6 14 0 15.8 0 18V20H6V18C6 16.9 6.9 16 8 16C9.1 16 10 16.9 10 18V20H16V18C16 15.8 12.4 14 8 14Z"/>
            </svg>
        )
    }
];

export function Values() {
    return(
        <section className="w-full min-h-screen justify-center items-center px-4 md:px-12 lg:px-24 py-16 flex flex-col gap-12 font-onest">
            
            {/* Section Header */}
            <AnimateOnLoad animation="fade-in-up">
                <div className="flex flex-col text-center gap-4 max-w-4xl mx-auto">
                    <h1 className="text-brand text-4xl md:text-5xl lg:text-6xl font-bold">Our Values</h1>
                    <p className="text-brand text-lg md:text-xl px-4">
                        The principles that guide our mission to transform the insurtech industry
                    </p>
                </div>
            </AnimateOnLoad>

            {/* Vision and Mission Container */}
            <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Vision */}
                    <AnimateOnLoad animation="fade-in-left" delay={200}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 border border-brand/20 hover:bg-white transition-all duration-300 ease-in-out shadow-lg h-full flex flex-col">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23M19 21H5V3H13V9H19V21Z"/>
                                    </svg>
                                </div>
                                <h2 className="text-brand text-3xl md:text-4xl font-bold mb-4">Vision</h2>
                            </div>
                            <div className="flex-1 flex items-start">
                                <p className="text-brand text-lg md:text-xl leading-relaxed text-center">
                                    To be the leading Insurtech provider in the region, transforming the way insurance claims, valuations, and assistance services are delivered through innovation, automation, and trust.
                                </p>
                            </div>
                        </div>
                    </AnimateOnLoad>

                    {/* Mission */}
                    <AnimateOnLoad animation="fade-in-right" delay={300}>
                        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 border border-brand/20 hover:bg-white transition-all duration-300 ease-in-out shadow-lg h-full flex flex-col">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
                                    </svg>
                                </div>
                                <h2 className="text-brand text-3xl md:text-4xl font-bold mb-4">Mission</h2>
                            </div>
                            <div className="flex-1 flex items-start">
                                <ul className="text-brand leading-relaxed space-y-3 w-full">
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-brand-element rounded-full mt-2 flex-shrink-0"></div>
                                        <span>To simplify and automate insurance processes for insurers, adjusters, workshops, and the public.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-brand-element rounded-full mt-2 flex-shrink-0"></div>
                                        <span>To connect all parties in the insurance ecosystem on one seamless digital platform.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-brand-element rounded-full mt-2 flex-shrink-0"></div>
                                        <span>To provide accurate, transparent, and accessible claims and valuation services with no vested interests.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-brand-element rounded-full mt-2 flex-shrink-0"></div>
                                        <span>To continuously innovate using AI and advanced technology for faster, smarter, and more reliable solutions.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </AnimateOnLoad>

                </div>
            </div>

            {/* Objectives Container */}
            <AnimateOnLoad animation="fade-in-up" delay={400}>
                <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-brand text-3xl md:text-4xl font-bold mb-4">Our Objectives</h2>
                        <p className="text-brand text-lg md:text-xl">
                            Strategic goals that drive our commitment to excellence
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {objectives.map((objective, index) => (
                            <AnimateOnLoad 
                                key={index}
                                animation="fade-in-up" 
                                delay={(index * 100 + 500) as 0 | 100 | 200 | 300 | 400}
                            >
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-brand/20 hover:bg-white hover:scale-105 transition-all duration-300 ease-in-out shadow-lg h-full">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-element rounded-full mb-4 text-white">
                                            {objective.icon}
                                        </div>
                                        <h3 className="text-brand text-xl font-semibold mb-3">{objective.title}</h3>
                                        <p className="text-brand/80 text-sm md:text-base leading-relaxed">{objective.description}</p>
                                    </div>
                                </div>
                            </AnimateOnLoad>
                        ))}
                    </div>
                </div>
            </AnimateOnLoad>

        </section>
    )
}