import AnimateOnLoad from "@/components/ui/AnimateOnLoad";
import Image from "next/image";

export function AchievementCard() {

    return(

        <div className="flex flex-col gap-4 md:gap-8">

            {/* MDEC certification section */}
            <div className="text-center w-full flex flex-col gap-4 md:gap-8 items-center">
                
                <AnimateOnLoad animation="fade-in" className="w-full flex justify-center">
                    <div className="bg-brand-white rounded-2xl md:rounded-3xl w-full md:w-fit p-8 md:p-10 h-48 border border-brand/20 shadow-lg hover:border-brand transition-all duration-300">
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
                    <h3 className="text-brand text-xl md:text-2xl font-bold">Registered with MDEC.</h3>
                </AnimateOnLoad>


            </div>
            
            {/* BNM and PIAM approval */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">

                <AnimateOnLoad animation="fade-in-left" delay={100} className="w-full flex justify-end">
                    <div className="bg-brand-white rounded-2xl md:rounded-3xl w-full md:max-w-sm p-8 md:p-10 h-48 border border-brand/20 hover:border-brand shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center h-full transition-transform duration-300">
                            <Image
                                src="/images/bnm.png"
                                alt="Bank Negara Malaysia"
                                width={280}
                                height={120}
                                className="object-contain"
                            />
                        </div>

                    </div>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-right" delay={200} className="w-full flex justify-start">
                    <div className="bg-brand-white rounded-2xl md:rounded-3xl w-full md:max-w-sm p-8 md:p-10 h-48 border border-brand/20 hover:border-brand shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center h-full transition-transform duration-300">
                            <Image
                                src="/images/piam.png"
                                alt="Persatuan Insurans Am Malaysia"
                                width={280}
                                height={120}
                                className="object-contain"
                            />
                        </div>

                    </div>
                </AnimateOnLoad>

            </div>

            <p className="text-brand text-center text-base md:text-xl font-bold">
                Recognized by Bank Negara Malaysia and the Insurance Association of Malaysia to provide accident vehicle damage estimation.
            </p>
            
        </div>

    )

}