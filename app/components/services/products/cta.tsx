import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { Button } from '../../ui/button';

interface ProductCTAProps {
    title:string,
    caption:string,
    button:string,
    link:string,
    target:string,
}

export function ProductCTA({title,caption,button,link,target}:ProductCTAProps) {
    return(
        <section className="w-full py-8 md:py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="bg-gradient-to-r from-brand to-brand-hover rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
                        
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
                            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col gap-8 justify-center items-center">
                            {/* Icon */}
                            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
                                </svg>
                            </div> */}
                            
                            {/* Main Content */}
                            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
                                {title}
                            </h2>
                            
                            <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                                {caption}
                            </p>


                            <Button href={link} target={target} variant="primary" className="text-2xl">
                                {button}
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

                {/* Additional Benefits */}
                {/* <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-brand-element/10 rounded-2xl p-6 border border-brand-element/20">
                                <svg className="w-8 h-8 text-brand-element mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12.5 7H13V13L16.2 16.2L15.1 17.3L11.5 13.7V7H12.5Z"/>
                                </svg>
                                <h3 className="text-brand font-bold mb-2">Quick Setup</h3>
                                <p className="text-brand/70 text-sm">Get started in minutes with our easy integration process</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-brand-element/10 rounded-2xl p-6 border border-brand-element/20">
                                <svg className="w-8 h-8 text-brand-element mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                                </svg>
                                <h3 className="text-brand font-bold mb-2">24/7 Support</h3>
                                <p className="text-brand/70 text-sm">Dedicated support team available around the clock</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-brand-element/10 rounded-2xl p-6 border border-brand-element/20">
                                <svg className="w-8 h-8 text-brand-element mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                                </svg>
                                <h3 className="text-brand font-bold mb-2">ROI Guaranteed</h3>
                                <p className="text-brand/70 text-sm">See measurable results within the first month</p>
                            </div>
                        </div>
                    </div>
                </AnimateOnLoad> */}

            </div>
        </section>
    )
}
