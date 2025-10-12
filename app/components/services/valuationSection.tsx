import { Button } from "../ui/button"
import { ArrowUpRight } from "lucide-react"
import AnimateOnLoad from "../ui/AnimateOnLoad"

export function ValuationBanner() {

    return(
        <AnimateOnLoad animation="fade-in-up">
            <div className="bg-[url('/images/g20.jpg')] bg-cover bg-center rounded-2xl md:rounded-3xl max-w-7xl mx-auto overflow-hidden relative">

                <div className="bg-black/70 w-full h-full px-4 md:px-16 py-4 md:py-16">
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        
                        {/* Text Content */}
                        <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left flex-1">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl text-brand-element font-bold leading-tight">
                                Get Real-Time Vehicle Valuation
                            </h2>
                            <p className="text-sm md:text-lg lg:text-xl text-brand-white font-medium">
                                Discover your car's current market value instantly with our advanced valuation tool
                            </p>
                        </div>
                        
                        {/* CTA Button */}
                        <div className="flex-shrink-1 w-full md:w-auto">
                            <Button 
                                variant="primary" 
                                size="md" 
                                href="/valuation" 
                                className="w-full md:w-auto text-base md:text-xl flex gap-2 whitespace-nowrap"
                            >
                                Try Now <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </div>
                        
                    </div>

                </div>
            </div>
        </AnimateOnLoad>
    )

}