import Image from "next/image"
import AnimateOnLoad from "../ui/AnimateOnLoad"
import { Button } from "../ui/button"

export function Background() {
    return (

        <section id="background" className="w-full bg-brand flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 py-16 font-onest text-white">

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl">

                <AnimateOnLoad animation="fade-in" className="h-full">
                    <div className="relative flex flex-col justify-end h-full flex flex-col gap-8">
                        <div className="h-full rounded-3xl overflow-hidden group">
                            <Image src="/images/mazda.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={1200} height={1200} alt="NICHOLAS"/>
                        </div>

                        <div className="absolute grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                            <div className="p-4 bg-brand-white/90 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-16">
                                    <Image src="/images/bnm.png" alt="BNM" width={160} height={64} className="h-full w-auto object-contain mx-auto" />
                                </div>
                            </div>
                            <div className="p-4 bg-brand-white/90 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-16">
                                    <Image src="/images/piam.png" alt="PIAM" width={160} height={64} className="h-full w-auto object-contain mx-auto" />
                                </div>
                            </div>
                            <div className="p-4 bg-brand-white/90 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-16">
                                    <Image src="/images/mdec.png" alt="MDEC" width={160} height={64} className="h-full w-auto object-contain mx-auto" />
                                </div>
                            </div>

                        </div>

                       
                    </div>
                </AnimateOnLoad>
                

                <AnimateOnLoad animation="fade-in-left" className="h-full">
                    <div className="w-full h-full flex flex-col gap-4 justify-center">
                        <h1 className="text-4xl lg:text-6xl font-bold">About SNK</h1>

                        {/* <p className="w-full">We are a pioneer in Malaysia’s Insurtech industry, with over 20 years of experience delivering innovative solutions for motor vehicle valuation and insurance claims. Since 2002, we have grown from providing valuation services to developing advanced digital platforms that connect insurers, adjusters, workshops, and customers in one seamless ecosystem. Our mission is to simplify and automate insurance processes through technology—making claims faster, valuations more accurate, and assistance more accessible to the public.</p> */}
                        <p className="w-full">We are a pioneer in Malaysia’s Insurtech industry, with over 25 years of experience. Our focus is to automate and innovate the motor claims ecosystem by improving the efficiency, accessibility and functionality of the end to end claims process, in order to better serve key stakeholders and meet the guidelines set by the regulators</p>

                        <hr className="w-full border border-background"/>
                        
                        <p className="w-full">We are registered with MDEC, and recognized by Bank Negara Malaysia and the Insurance Association of Malaysia (PIAM), and trusted by leading insurers in Malaysia and across Asia.</p>

                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-brand-white/90 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-16">
                                    <Image src="/images/bnm.png" alt="BNM" width={160} height={64} className="h-full w-auto object-contain mx-auto" />
                                </div>
                            </div>
                            <div className="p-4 bg-brand-white/90 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-16">
                                    <Image src="/images/piam.png" alt="PIAM" width={160} height={64} className="h-full w-auto object-contain mx-auto" />
                                </div>
                            </div>
                            <div className="p-4 bg-brand-white/90 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-16">
                                    <Image src="/images/mdec.png" alt="MDEC" width={160} height={64} className="h-full w-auto object-contain mx-auto" />
                                </div>
                            </div>

                        </div> */}

                        <Button href="/about">
                            <p>Learn more about SNK</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                        </Button>

                    </div>
                </AnimateOnLoad>

            </div>

        </section>

    )
}