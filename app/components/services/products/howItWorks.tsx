import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface Step {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const steps: Step[] = [
    {
        number: "01",
        title: "Upload Photos",
        description: "Simply upload clear photos of the vehicle damage from multiple angles using our intuitive interface.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
        )
    },
    {
        number: "02",
        title: "AI Analysis",
        description: "Our advanced AI algorithms analyze the damage patterns, identifying affected components and severity levels.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
            </svg>
        )
    },
    {
        number: "03",
        title: "Cost Calculation",
        description: "The system calculates repair costs using real-time market data, labor rates, and parts pricing.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
            </svg>
        )
    },
    {
        number: "04",
        title: "Generate Report",
        description: "Receive a damage report with photos, cost breakdown, and repair recommendations.",
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
        )
    }
];

export function AllClaimsHowItWorks() {
    return(
        <section className="w-full bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40 py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                {/* Section Header */}
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center mb-16">
                        <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-brand text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Get accurate damage assessments in just four simple steps. Our streamlined process saves time while delivering precise results.
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="relative">
                                {/* Step Card */}
                                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-brand/20 shadow-lg h-full flex flex-col relative z-10">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">{step.number}</span>
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-element rounded-2xl mb-6 text-white mx-auto mt-4">
                                        {step.icon}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="text-center flex-1">
                                        <h3 className="text-brand text-xl md:text-2xl font-bold mb-4">{step.title}</h3>
                                        <p className="text-brand/80 text-base leading-relaxed">{step.description}</p>
                                    </div>
                                </div>

                                {/* Connection Line (except for last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-brand-element/30 z-0"></div>
                                )}
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>

                {/* Process Timeline
                <AnimateOnLoad animation="fade-in-up" delay={400}>
                    <div className="mt-16 bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-brand/20 shadow-lg">
                        <div className="text-center mb-8">
                            <h3 className="text-brand text-2xl md:text-3xl font-bold mb-4">Complete Process Timeline</h3>
                            <p className="text-brand text-lg">From photo upload to final report delivery</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="bg-brand-element rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h4 className="text-brand font-semibold mb-2">Upload</h4>
                                <p className="text-brand/70 text-sm">30 seconds</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-brand-element rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h4 className="text-brand font-semibold mb-2">Analysis</h4>
                                <p className="text-brand/70 text-sm">2-3 minutes</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-brand-element rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h4 className="text-brand font-semibold mb-2">Calculation</h4>
                                <p className="text-brand/70 text-sm">1-2 minutes</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-brand-element rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <h4 className="text-brand font-semibold mb-2">Report</h4>
                                <p className="text-brand/70 text-sm">Instant</p>
                            </div>
                        </div>
                        
                        <div className="text-center mt-8">
                            <div className="inline-flex items-center gap-2 bg-brand-element/10 rounded-full px-6 py-3">
                                <svg className="w-5 h-5 text-brand-element" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12.5 7H13V13L16.2 16.2L15.1 17.3L11.5 13.7V7H12.5Z"/>
                                </svg>
                                <span className="text-brand font-bold">Total Time: 5 minutes or less</span>
                            </div>
                        </div>
                    </div>
                </AnimateOnLoad> */}

            </div>
        </section>
    )
}
