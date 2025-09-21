import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import Image from 'next/image';

export function AllClaimsOverview() {
    return(
        <section className="w-full bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40 py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Content */}
                    <AnimateOnLoad animation="fade-in-left">
                        <div className="space-y-6">
                            <h2 className="text-brand text-4xl md:text-5xl font-bold">Revolutionary Damage Assessment</h2>
                            <p className="text-brand text-lg md:text-xl leading-relaxed">
                                AllClaims leverages cutting-edge artificial intelligence and computer vision technology to analyze vehicle damage from photos, providing instant, accurate repair estimates that streamline the claims process.
                            </p>
                            <p className="text-brand/80 text-base md:text-lg leading-relaxed">
                                Our system processes thousands of damage scenarios, learning from each assessment to continuously improve accuracy and reduce processing time from hours to minutes.
                            </p>
                            
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-brand/20 shadow-lg">
                                    <div className="text-brand text-3xl font-bold mb-2">95%</div>
                                    <div className="text-brand text-sm font-medium">Accuracy Rate</div>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-brand/20 shadow-lg">
                                    <div className="text-brand text-3xl font-bold mb-2">5 min</div>
                                    <div className="text-brand text-sm font-medium">Average Processing</div>
                                </div>
                            </div>
                        </div>
                    </AnimateOnLoad>

                    {/* Visual */}
                    <AnimateOnLoad animation="fade-in-right">
                        <div className="relative">
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-brand/20 shadow-lg">
                                <div className="text-center mb-6">
                                    <h3 className="text-brand text-2xl font-bold mb-4">Valuation Tool Interface</h3>
                                    <div className="relative h-80 bg-gradient-to-br from-brand-element/10 to-brand/10 rounded-2xl overflow-hidden">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimateOnLoad>

                </div>
            </div>
        </section>
    )
}
