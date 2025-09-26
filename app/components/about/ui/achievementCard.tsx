import AnimateOnLoad from "@/components/ui/AnimateOnLoad";
import Image from "next/image";

export function AchievementCard() {

    return(

        <div className="flex flex-col gap-8">

            {/* MDEC certification section */}
            <div className="text-center w-full flex flex-col gap-8 justify-center items-center">
                
                <AnimateOnLoad animation="fade-in">

                    <div className="bg-brand-white rounded-3xl p-8 border border-brand/20 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 w-96 h-48">
                    
                        <div className="relative h-full">
                            <Image src="/images/mdec.png" alt="MDEC" fill className="object-contain" />
                        </div>

                    </div>

                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in">
                    <h3 className="text-brand text-3xl font-bold">Registered with MDEC.</h3>
                </AnimateOnLoad>


            </div>
            
            {/* BNM and PIAM approval */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">

                <AnimateOnLoad animation="fade-in-left" delay={100}>
                    <div className="bg-brand-white rounded-3xl w-fit p-4 px-8 border border-brand/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative w-72 h-48 transition-transform duration-300">
                                <Image
                                    src="/images/bnm.png"
                                    alt="Bank Negara Malaysia"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {/* <div>
                                <h3 className="text-brand text-xl font-bold">Bank Negara Malaysia</h3>
                                <p className="text-brand">Regulatory Approval</p>
                            </div> */}
                        </div>
                    </div>
                </AnimateOnLoad>


                <AnimateOnLoad animation="fade-in-right" delay={200}>
                    <div className="bg-brand-white rounded-3xl w-fit p-4 px-8 border border-brand/20 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative w-72 h-48 transition-transform duration-300">
                                <Image
                                    src="/images/piam.png"
                                    alt="Persatuan Insurans Am Malaysia"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {/* <div>
                                <h3 className="text-brand text-xl font-bold">PIAM</h3>
                                <p className="text-brand">Insurance Association</p>
                            </div> */}
                        </div>
                    </div>
                </AnimateOnLoad>

            </div>

            <p className="text-brand text-center text-lg md:text-xl px-4 font-bold">
                Recognized by Bank Negara Malaysia and the Insurance Association of Malaysia to provide accident vehicle damage estimation.
            </p>
            
        </div>

    )

}