import { Button } from "@/components/ui/button"
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

export function HeroSection() {

    return (

        <section className="w-full bg-brand min-h-screen bg-[url('/images/g70.jpg')] bg-cover bg-center bg-fixed flex flex-col justify-center items-center">
            <div className="min-h-screen w-full bg-black/20 backdrop-blur-sm flex flex-col justify-center items-center px-24 py-16">

            <div className="mx-auto font-onest">
                <AnimateOnLoad animation="fade-in-up">
                <div className="text-center">

                    <h1 className="text-6xl text-brand font-bold mb-6 drop-shadow-sm">
                        Redefining Vehicle Insurance
                        <span className="block text-6xl text-brand-foreground mt-2">Through Technology and Experience</span>
                    </h1>

                    <p className="text-xl text-brand-foreground mb-8 max-w-4xl mx-auto drop-shadow-sm">
                        Helping insurers and the public with claims, valuations, and roadside assistance.
                        <span className="block">With over 20 years of expertise.</span>
                    </p>
                    

                    <Button variant="secondary" className="text-xl" size="sm" href="#background">
                        Explore
                        <svg 
                            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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