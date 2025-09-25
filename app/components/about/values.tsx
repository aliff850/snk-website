import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { Crosshair } from 'lucide-react';

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-binary-icon lucide-binary"><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/></svg>
        )
    },
    {
        title: "Data-Driven Decisions",
        description: "Empower insurers and customers with real-time data, valuations, and tools for better decision-making.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big-icon lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
        )
    },
    {
        title: "Seamless Customer Experience",
        description: "Enhance customer experience through roadside assistance, claims support, and easy-to-use digital platforms.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>
        )
    },
    {
        title: "Regional Growth with Integrity",
        description: "Expand regionally while maintaining credibility, innovation, and customer-first values.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined"><path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye text-brand-white"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crosshair-icon lucide-crosshair text-brand-white"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>
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