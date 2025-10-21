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
        <section className="w-full py-4 md:py-16 px-2 md:px-12 lg:px-24 font-onest relative">
            
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-16">
                {/* Section Header */}
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center gap-2 text-brand-element font-semibold text-sm tracking-wider mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-element to-transparent"></div>
                            FEATURES
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-element to-transparent"></div>
                        </div>
                        <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6 leading-tight">{header}</h2>
                        <p className="text-brand/70 md:text-xl leading-relaxed">
                            {caption}
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* Features Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {features.map((feature, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="group relative bg-brand-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-brand/50 hover:border-brand shadow-lg transition-all duration-500 h-full overflow-hidden">
                                
                                
                                {/* feature number */}
                                <div className="absolute -right-6 -top-6 text-[120px] md:text-[140px] font-black text-brand/5 group-hover:text-brand/10 transition-all duration-500 select-none pointer-events-none leading-none">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                
                                <div className="flex flex-col gap-5 relative z-10">
                                    {/* Icon Badge */}
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-hover group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                        <div className="text-white text-2xl font-bold">{index + 1}</div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="space-y-4">
                                        <h3 className="text-brand text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-hover transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-brand/70 text-base leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <div className="w-12 h-1 bg-gradient-to-r from-brand-element to-transparent rounded-full opacity-0 group-hover:opacity-100 group-hover:w-24 transition-all duration-500"></div>
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>


            </div>
        </section>
    )
}