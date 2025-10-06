import { Button } from "../ui/button"
import { ArrowUpRight } from "lucide-react"
import AnimateOnLoad from "../ui/AnimateOnLoad"

export function ValuationCTA() {

    return(
        // text color: --color-brand-white: #FFFFFF;
        // background for section --color-brand-bg: #B2252B;

        <section className="bg-[url('/images/g20_2.jpg')] bg-cover bg-center bg-fixed font-onest text-brand-white">
            <div className="bg-black/70 w-full h-full px-4 md:px-12 lg:px-24 py-4 md:py-16">

                <div className="w-full mx-auto flex flex-col gap-8 justify-center items-center p-16 max-w-7xl">
                    <AnimateOnLoad animation="fade-in-up">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-6xl text-center text-brand-element font-bold">Looking To Get The Latest Market Value For Your Car?</h1>
                            <p className="text-3xl text-center text-brand-white font-bold">Try Our Online Vehicle Market Valuation Today</p>
                        </div>
                    </AnimateOnLoad>
                    
                    <AnimateOnLoad animation="fade-in-up">
                        <Button variant="primary" size="md" href="/valuation" className="text-2xl flex gap-2">Try Now <ArrowUpRight /></Button>
                    </AnimateOnLoad>
                    
                    
                </div>

            </div>
            

        </section>
    )

}