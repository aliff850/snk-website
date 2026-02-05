import { Button } from "@/components/ui/button"
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { ChevronRight } from "lucide-react";
import dynamic from 'next/dynamic';

const LiquidBackground = dynamic(() => import('./LiquidBackground'), { ssr: false });

export function HeroSection() {

    return (

        <section className="bg-brand min-h-svh relative flex flex-col justify-center items-center overflow-hidden bg-[url('/images/w214.jpg')] bg-cover bg-center bg-fixed">

            {/* Just comment this out if the effect is too overbearing */}
            {/* <LiquidBackground /> */}

            <div className="relative h-svh w-full bg-gradient-to-b from-black/50 via-black/50 to-brand/50 flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 py-8">

                <div className="mx-auto max-w-7xl">
                    <AnimateOnLoad animation="fade-in-up">
                        <div className="text-center flex flex-col gap-4 md:gap-6">

                            <div className="flex flex-col drop-shadow-lg">
                                <h1 className="text-brand-element text-5xl md:text-9xl font-audiowide">REDEFINING</h1>
                                <span className="text-brand-element text-2xl md:text-6xl font-audiowide">The Insurance Ecosystem</span>
                                <span className="block text-xl md:text-5xl text-brand-white font-onest font-bold">Through Technology and Experience</span>
                            </div>

                            <p className="md:text-xl text-brand-foreground max-w-4xl mx-auto drop-shadow-sm font-onest">
                                Helping insurers and the public with underwriting, claims, customer service marketing, valuations, and roadside assistance.&nbsp;
                                <span className="underline italic">With over 25 years of expertise.</span>
                            </p>

                            {/* <Button variant="secondary" size="base" href="#clients" className="text-lg md:text-xl flex gap-1 pointer-events-auto">
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