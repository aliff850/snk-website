import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface Feature {
    title: string;
    description: string;
}

interface FeatureProps {
    header: string;
    caption: string;
    features: Feature[];
}

export function ProductFeatures({header, caption, features}: FeatureProps) {
    return(
        <section className="w-full py-8 md:py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                {/* Section Header */}
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6">{header}</h2>
                        <p className="text-brand text-lg md:text-xl mx-auto leading-relaxed">
                            {caption}
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {features.map((feature, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-brand text-brand-white rounded-3xl p-8 border border-brand/10 hover:border-brand/20 hover:shadow-xl hover:scale-105 transition-all duration-500 ease-out h-full group relative overflow-hidden">
                                {/* Feature Number */}
                                <div className="absolute -left-4 -top-4 text-8xl md:text-9xl font-bold text-brand-white/20 select-none pointer-events-none">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                
                                <div className="flex flex-col h-full relative z-10">
                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-brand-white text-xl md:text-2xl font-bold mb-4">{feature.title}</h3>
                                        <p className="text-brand-white text-base leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>

                {/* Additional Benefits */}
                {/* <AnimateOnLoad animation="fade-in-up" delay={400}>
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
                </AnimateOnLoad> */}

            </div>
        </section>
    )
}
