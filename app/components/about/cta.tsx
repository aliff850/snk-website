import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { Button } from '../ui/button';


export function AboutCTA() {
    return(
        <section className="w-full py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-5xl mx-auto">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="bg-gradient-to-r from-brand to-brand-hover rounded-3xl p-12 text-center shadow-lg relative overflow-hidden">
                        
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
                            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                        </div>
                        {/* WOOOOOOOOO AI!!!!!!!! */}

                        <div className="relative z-10 flex flex-col gap-8 justify-center items-center">
                            {/* Icon */}
                            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
                                </svg>
                            </div> */}
                            
                            {/* Main Content */}
                            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
                                Ready to Revolutionize your Vehicle Valuation Journey?
                            </h2>
                            
                            <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                                Join leading insurance companies who have already utilized SNK's efficient and revolutionary services and offerings.
                            </p>


                            <Button href="/services" variant="primary" className="text-2xl">
                                Explore Our Products
                            </Button>
                            
                            {/* CTA Buttons */}
                            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    className="bg-white text-brand hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold"
                                >
                                    Start Free Trial
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="lg"
                                    className="border-2 border-white text-white hover:bg-white hover:text-brand text-lg px-8 py-4 rounded-xl font-semibold"
                                >
                                    Schedule Demo
                                </Button>
                            </div> */}
                            
                            {/* Trust Indicators */}
                            {/* <div className="border-t border-white/20 pt-6">
                                <p className="text-white text-sm mb-4 opacity-80">Trusted by leading insurers</p>
                                <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
                                    <div className="text-white font-semibold">Allianz</div>
                                    <div className="text-white font-semibold">Etiqa</div>
                                    <div className="text-white font-semibold">MSIG</div>
                                    <div className="text-white font-semibold">Tokio Marine</div>
                                    <div className="text-white font-semibold">Great Eastern</div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </AnimateOnLoad>


            </div>
        </section>
    )
}
