import Image from "next/image"
import AnimateOnLoad from "../ui/AnimateOnLoad"
import { Button } from "../ui/button"

export function Background() {
    return (

        <section id="background" className="w-full bg-brand min-h-screen justify-center items-center px-24 py-16 grid sm:grid-cols-1 md:grid-cols-2 gap-8 font-onest text-white">

            <AnimateOnLoad animation="fade-in" className="h-full">
                <div className="h-full rounded-4xl overflow-hidden group">
                    <Image src="/images/mazda.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={1200} height={1200} alt="NICHOLAS"/>
                </div>
            </AnimateOnLoad>
            

            <AnimateOnLoad animation="fade-in-left">
            <div className="w-full flex flex-col gap-4 items-start">
                <h1 className="text-6xl font-bold">About SNK</h1>

                <p className="w-full">We are a pioneer in Malaysia’s Insurtech industry, with over 20 years of experience delivering innovative solutions for motor vehicle valuation and insurance claims. Since 2002, we have grown from providing valuation services to developing advanced digital platforms that connect insurers, adjusters, workshops, and customers in one seamless ecosystem. Our mission is to simplify and automate insurance processes through technology—making claims faster, valuations more accurate, and assistance more accessible to the public.</p>

                <hr className="w-full border border-background"/>

                <div className="grid grid-cols-3 gap-4 rounded-2xl p-4 bg-brand-white/90 border border-brand-element/40">
                    <div className="">
                        <div className="w-full h-24 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-500">
                            <Image src="/images/bnm.png" alt="Bank Negara Malaysia" width={200} height={80} className="w-auto h-full object-contain opacity-90" />
                        </div>
                    </div>
                    <div className="">
                        <div className="w-full h-24 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-500">
                            <Image src="/images/piam.png" alt="PIAM" width={200} height={80} className="w-auto h-full object-contain opacity-90" />
                        </div>
                    </div>
                    <div className="">
                        <div className="w-full h-24 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-500">
                            <Image src="/images/mdec.png" alt="MDEC" width={200} height={80} className="w-auto h-full object-contain opacity-90" />
                        </div>
                    </div>

                </div>
                
                <p className="w-full">We are registered with MDEC, and recognized by Bank Negara Malaysia and the Insurance Association of Malaysia (PIAM), and trusted by leading insurers in Malaysia and across Asia.</p>

                <Button href="/about">
                    <p>Learn more about SNK</p>
                </Button>

            </div>
            </AnimateOnLoad>

        </section>

    )
}