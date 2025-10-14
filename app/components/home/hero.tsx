import { Button } from "@/components/ui/button"
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

export function HeroSection() {

    return (

        <section className="bg-brand min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center bg-fixed flex flex-col justify-center items-center">
            <div className="h-svh w-full bg-black/50 flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 py-16">

                <div className="mx-auto max-w-7xl font-onest">
                    <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center">

                        <h1 className="text-5xl md:text-7xl text-brand-element font-bold mb-6 drop-shadow-sm">
                            Redefining Vehicle Insurance
                            <span className="block text-4xl md:text-6xl text-brand-foreground mt-4">Through Technology and Experience</span>
                        </h1>

                        <p className="text-xl text-brand-foreground mb-8 max-w-4xl mx-auto drop-shadow-sm">
                            Helping insurers and the public with claims, valuations, and roadside assistance.
                            <span className="block">With over 25 years of expertise.</span>
                        </p>
                        

                        <Button variant="secondary" size="md" href="#background" className="text-2xl">
                            Explore
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
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