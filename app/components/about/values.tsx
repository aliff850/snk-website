import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { Crosshair, Eye } from 'lucide-react';

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-binary-icon lucide-binary"><rect x="14" y="14" width="4" height="6" rx="2" /><rect x="6" y="4" width="4" height="6" rx="2" /><path d="M6 20h4" /><path d="M14 10h4" /><path d="M6 14h2v6" /><path d="M14 4h2v6" /></svg>
        )
    },
    {
        title: "Data-Driven Decisions",
        description: "Empower insurers and customers with real-time data, valuations, and tools for better decision-making.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big-icon lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>
        )
    },
    {
        title: "Seamless Customer Experience",
        description: "Enhance customer experience through roadside assistance, claims support, and easy-to-use digital platforms.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="m16 19 2 2 4-4" /></svg>
        )
    },
    {
        title: "Regional Growth with Integrity",
        description: "Expand regionally while maintaining credibility, innovation, and customer-first values.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5" /><path d="M16 14v7" /><path d="M20 10v11" /><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" /><path d="M4 18v3" /><path d="M8 14v7" /></svg>
        )
    }
];

export function Values() {
    return (
        <section className="w-full min-h-svh justify-center items-center px-4 md:px-12 lg:px-24 py-8 md:py-12 flex flex-col gap-4 md:gap-6 font-onest">

            {/* Section Header */}
            <AnimateOnLoad animation="fade-in-up">
                <div className="flex flex-col text-center gap-2 md:gap-4 max-w-4xl mx-auto">
                    <h1 className="text-brand text-3xl md:text-4xl font-bold">Our Values</h1>
                    <p className="text-brand text-base">
                        The principles that guide our mission to bring transformation to the insurtech industry.
                    </p>
                </div>
            </AnimateOnLoad>

            {/* VISION AND MISSION CONTAINER */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                <AnimateOnLoad animation="fade-in-left" delay={200}>
                    <div className="bg-brand-white rounded-2xl md:rounded-3xl p-6 md:p-12 flex flex-col justify-center items-center md:gap-4 ring-1 ring-brand/20 hover:ring-brand duration-500 transition-ring shadow-lg h-full group">

                        <div className="text-center p-4 w-48">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-element group-hover:bg-brand transition-colors duration-500 rounded-full mb-4">
                                <Eye className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-brand text-2xl md:text-3xl font-bold">Vision</h2>
                        </div>

                        <div>
                            <p className="text-sm md:text-base text-brand text-center leading-relaxed">
                                To be the leading Insurtech provider in the region, transforming the insurance ecosystem through innovation, automation, and trust. We envision a seamless digital environment where insurers, adjusters, workshops, and the public are connected through transparent, efficient, and technology-driven claims and assistance services.
                            </p>
                        </div>

                    </div>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-right" delay={300}>
                    <div className="bg-brand-white rounded-2xl md:rounded-3xl p-6 md:p-12 flex flex-col justify-center items-center md:gap-4 ring-1 ring-brand/20 hover:ring-brand duration-500 transition-ring shadow-lg h-full group">

                        <div className="text-center p-4 w-48">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-element group-hover:bg-brand transition-colors duration-500 rounded-full mb-4">
                                <Crosshair className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-brand text-2xl md:text-3xl font-bold">Mission</h2>
                        </div>

                        <div>
                            <p className="text-sm md:text-base text-brand text-center leading-relaxed">
                                Our mission is to simplify and automate insurance processes by uniting all stakeholders on a single digital platform. We are committed to delivering accurate, transparent, and accessible valuation and claims solutions powered by advanced technologies, and make insurance processes faster, smarter, and more reliable for everyone.
                            </p>

                        </div>
                    </div>
                </AnimateOnLoad>

            </div>


            {/* Objectives Container */}
            <AnimateOnLoad animation="fade-in-up" delay={400}>
                <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center py-4 md:py-6 flex flex-col gap-2">
                        <h2 className="text-brand text-3xl md:text-4xl font-bold">Our Objectives</h2>
                        <p className="text-brand text-base">
                            Strategic goals that drive our commitment to excellence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {objectives.map((objective, index) => (
                            <AnimateOnLoad
                                key={index}
                                animation="fade-in-up"
                                delay={(index * 100 + 500) as 0 | 100 | 200 | 300 | 400}
                            >
                                <div className="group bg-brand-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 ring-1 ring-brand/20 hover:ring-brand hover:bg-white hover:scale-105 transition-all duration-500 ease-in-out shadow-lg h-full">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-element group-hover:bg-brand transition-colors duration-500 ease-in-out rounded-full mb-4 text-white">
                                            {objective.icon}
                                        </div>
                                        <h3 className="text-brand text-xl font-semibold mb-3">{objective.title}</h3>
                                        <p className="text-brand text-sm md:text-base leading-relaxed">{objective.description}</p>
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