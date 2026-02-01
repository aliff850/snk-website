import { Button } from "@/components/ui/button"
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { ChevronRight } from "lucide-react";

export function HeroSection() {

    return (

        <section className="bg-brand min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center bg-fixed flex flex-col justify-center items-center">
            <div className="h-svh w-full bg-black/50 flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 py-8">

                <div className="mx-auto max-w-7xl font-onest">
                    <AnimateOnLoad animation="fade-in-up">
                        <div className="text-center">

                            <h1 className="text-4xl md:text-6xl text-brand-element font-bold mb-2 md:mb-6 drop-shadow-sm">
                                Redefining The Insurance Ecosystem
                                <span className="block text-3xl md:text-5xl text-brand-foreground mt-2 md:mt-4">Through Technology and Experience</span>
                            </h1>

                            <p className="text-lg md:text-xl text-brand-foreground mb-4 md:mb-8 max-w-4xl mx-auto drop-shadow-sm">
                                Helping insurers and the public with underwriting, claims, customer service marketing, valuations, and roadside assistance.&nbsp;
                                <span className="underline italic">With over 25 years of expertise.</span>
                            </p>

                            {/* <Button variant="secondary" size="base" href="#clients" className="text-lg md:text-xl flex gap-1">
                            Find Out More
                            <ChevronRight className="w-8 h-8" />
                        </Button> */}

                        </div>
                    </AnimateOnLoad>

                </div>

            </div>

        </section>

    )
}