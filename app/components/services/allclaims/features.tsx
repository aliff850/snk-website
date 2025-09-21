import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const features: Feature[] = [
    {
        title: "AI-Powered Analysis",
        description: "Advanced machine learning algorithms analyze damage patterns with 95% accuracy, identifying even subtle structural issues.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
            </svg>
        )
    },
    {
        title: "Real-Time Processing",
        description: "Get instant damage assessments in minutes instead of hours, dramatically reducing claim processing time.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12.5 7H13V13L16.2 16.2L15.1 17.3L11.5 13.7V7H12.5Z"/>
            </svg>
        )
    },
    {
        title: "Mobile Compatibility",
        description: "Access AllClaims from any device with our responsive web interface and mobile app integration.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 19H7V5H17M17 1H7C5.89 1 5 1.89 5 3V21C5 22.11 5.89 23 7 23H17C18.11 23 19 22.11 19 21V3C19 1.89 18.11 1 17 1Z"/>
            </svg>
        )
    },
    {
        title: "Insurance Integration",
        description: "Seamlessly integrates with existing insurance systems and workflows for smooth adoption.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
            </svg>
        )
    },
    {
        title: "Comprehensive Coverage",
        description: "Handles all vehicle types including cars, motorcycles, commercial vehicles, and specialty equipment.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23M19 21H5V3H13V9H19V21Z"/>
            </svg>
        )
    },
    {
        title: "Detailed Reporting",
        description: "Generate comprehensive reports with photos, damage assessments, and cost breakdowns for all stakeholders.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
        )
    }
];

export function AllClaimsFeatures() {
    return(
        <section className="w-full bg-white py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                {/* Section Header */}
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center mb-16">
                        <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6">Powerful Features</h2>
                        <p className="text-brand text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            AllClaims combines cutting-edge technology with user-friendly design to deliver the most comprehensive damage assessment solution available.
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-gradient-to-br from-brand-element/5 to-brand/5 rounded-3xl p-8 border border-brand/10 hover:border-brand/20 hover:shadow-lg transition-all duration-300 ease-in-out h-full">
                                <div className="flex flex-col h-full">
                                    {/* Icon */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-2xl mb-6 text-white">
                                        {feature.icon}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-brand text-xl md:text-2xl font-bold mb-4">{feature.title}</h3>
                                        <p className="text-brand/80 text-base leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>

                {/* Additional Benefits */}
                <AnimateOnLoad animation="fade-in-up" delay={400}>
                    <div className="mt-16 bg-gradient-to-r from-brand-element/10 to-brand/10 rounded-3xl p-8 border border-brand/20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-brand text-3xl md:text-4xl font-bold mb-2">24/7</div>
                                <div className="text-brand text-lg font-medium">Availability</div>
                                <p className="text-brand/70 text-sm mt-2">Always accessible for urgent assessments</p>
                            </div>
                            <div>
                                <div className="text-brand text-3xl md:text-4xl font-bold mb-2">99.9%</div>
                                <div className="text-brand text-lg font-medium">Uptime</div>
                                <p className="text-brand/70 text-sm mt-2">Reliable service when you need it most</p>
                            </div>
                            <div>
                                <div className="text-brand text-3xl md:text-4xl font-bold mb-2">API</div>
                                <div className="text-brand text-lg font-medium">Integration</div>
                                <p className="text-brand/70 text-sm mt-2">Easy integration with existing systems</p>
                            </div>
                        </div>
                    </div>
                </AnimateOnLoad>

            </div>
        </section>
    )
}
