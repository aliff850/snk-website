import AnimateOnLoad from "@/components/ui/AnimateOnLoad";
import Image from "next/image";

export function AchievementCard() {

    return(

        <div className="flex flex-col gap-8">

            {/* MDEC certification section */}
            <div className="text-center w-full flex flex-col gap-8 justify-center items-center">
                
                <AnimateOnLoad animation="fade-in">

                    <div className="bg-brand-white rounded-3xl w-full max-w-sm mx-auto p-10 h-48 border border-brand/20 shadow-lg hover:border-brand hover:scale-105 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center h-full">
                            <Image 
                                src="/images/mdec.png" 
                                alt="MDEC" 
                                width={300} 
                                height={120} 
                                className="object-contain" 
                            />
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
                    <div className="bg-brand-white rounded-3xl w-full max-w-sm p-10 h-48 border border-brand/20 hover:border-brand shadow-lg hover:scale-105 transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center h-full transition-transform duration-300">
                            <Image
                                src="/images/bnm.png"
                                alt="Bank Negara Malaysia"
                                width={280}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                        {/* <div>
                            <h3 className="text-brand text-xl font-bold">Bank Negara Malaysia</h3>
                            <p className="text-brand">Regulatory Approval</p>
                        </div> */}
                    </div>
                </AnimateOnLoad>


                <AnimateOnLoad animation="fade-in-right" delay={200}>
                    <div className="bg-brand-white rounded-3xl w-full max-w-sm p-10 h-48 border border-brand/20 hover:border-brand shadow-lg hover:scale-105 transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center h-full transition-transform duration-300">
                            <Image
                                src="/images/piam.png"
                                alt="Persatuan Insurans Am Malaysia"
                                width={280}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                        {/* <div>
                            <h3 className="text-brand text-xl font-bold">PIAM</h3>
                            <p className="text-brand">Insurance Association</p>
                        </div> */}
                    </div>
                </AnimateOnLoad>

            </div>

            <p className="text-brand text-center text-lg md:text-xl px-4 font-bold">
                Recognized by Bank Negara Malaysia and the Insurance Association of Malaysia to provide accident vehicle damage estimation.
            </p>
            
        </div>

    )

}