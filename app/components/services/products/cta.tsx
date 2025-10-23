import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { Button } from '../../ui/button';
import { ArrowUpRight } from "lucide-react"

interface ProductCTAProps {
    title:string,
    caption:string,
    button:string,
    link:string,
    target:string,
}

export function ProductCTA({title,caption,button,link,target}:ProductCTAProps) {
    return(
        <section className="w-full py-8 md:py-16 px-2 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="bg-gradient-to-r from-brand to-brand-hover rounded-2xl md:rounded-3xl p-6 md:p-12 text-center shadow-lg relative overflow-hidden">
                        
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
                            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col gap-8 justify-center items-center">
                                                        
                            {/* Main Content */}
                            <h2 className="text-white text-3xl md:text-4xl font-bold">
                                {title}
                            </h2>
                            
                            <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                                {caption}
                            </p>


                            <Button href={link} target={target} variant="primary" className="flex gap-1 md:gap-2 text-base font-semibold md:font-bold md:text-xl">
                                {button} <ArrowUpRight/>
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
                            
                            
                        </div>
                    </div>
                </AnimateOnLoad>

                

            </div>
        </section>
    )
}
