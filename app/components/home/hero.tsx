import { Button } from "@/components/ui/button"
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { ChevronRight } from "lucide-react";

export function HeroSection() {

    return (

        <section className="bg-brand min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center bg-fixed flex flex-col justify-center items-center">
            <div className="h-svh w-full bg-black/50 flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 md:py-16 pt-32 pb-16">

                <div className="mx-auto max-w-7xl font-onest">
                    <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center">

                        <h1 className="text-4xl md:text-6xl text-brand-element font-bold mb-6 drop-shadow-sm">
                            Redefining Vehicle Insurance
                            <span className="block text-3xl md:text-5xl text-brand-foreground mt-4">Through Technology and Experience</span>
                        </h1>

                        <p className="text-lg md:text-xl text-brand-foreground mb-8 max-w-4xl mx-auto drop-shadow-sm">
                            Helping insurers and the public with claims, valuations, and roadside assistance.
                            <span className="block">With over 25 years of expertise.</span>
                        </p>
                        

                        <Button variant="secondary" size="base" href="#clients" className="text-lg md:text-xl flex gap-2">
                            Explore
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                        
                        {/* <button className="px-16 py-2 font-bold rounded-xl bg-brand text-white hover:scale-105 transition-all duration-300">
                            Explore
                        </button> */}
                        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-brand">
                                Learn More
                            </button>
                            <button className="border border-brand">
                                Our Solutions
                            </button>
                        </div> */}
                    </div>
                    </AnimateOnLoad>
                
                </div>

            </div>

        </section>
        
    )
}