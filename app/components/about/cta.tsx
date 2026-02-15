import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import { Button } from '../ui/ButtonComponent'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import SectionContainer from '@/components/ui/SectionContainer'

export function AboutCTA() {
    return (
        <SectionContainer variant="brand-bg">
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
                <div className="w-full max-w-5xl mx-auto">

                    <AnimateOnLoad animation="fade-in-up">
                        <div className="bg-gradient-to-r from-brand to-brand-hover rounded-2xl md:rounded-3xl p-4 md:p-10 text-center shadow-lg relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
                                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
                                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                            </div>
                            {/* WOOOOOOOOO AI!!!!!!!! */}

                            <div className="relative z-10 flex flex-col gap-6 justify-center items-center">
                                {/* Main Content */}
                                <h2 className="text-white text-2xl md:text-3xl font-bold">
                                    Ready to Revolutionize your Vehicle Valuation Journey?
                                </h2>

                                <p className="text-white text-base max-w-3xl mx-auto leading-relaxed opacity-90">
                                    Join leading insurance companies who have already utilized SNK's efficient and revolutionary services and offerings.
                                </p>

                                <Button href="/services" variant="primary" className="text-lg md:text-xl flex gap-2">
                                    Explore Our Products <ArrowUpRight className="h-8 w-8" />
                                </Button>

                                {/* CTA Buttons */}
                                {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    className="bg-white text-brand hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold"
                                >
                                    Start Free Trial
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="lg"
                                    className="border-2 border-white text-white hover:bg-white hover:text-brand text-lg px-8 py-4 rounded-xl font-semibold"
                                >
                                    Schedule Demo
                                </Button>
                            </div> */}

                                {/* Trust Indicators */}
                                <div className="flex flex-col items-center justify-center border-t border-white/50 pt-4 md:pt-6 gap-4 md:gap-6">

                                    <p className="text-brand-white font-bold">Trusted by leading insurers</p>

                                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center bg-brand-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg">
                                        <Image
                                            src="/clients/allianz.svg"
                                            alt="Allianz"
                                            width={120}
                                            height={40}
                                            className="h-6 md:h-8 w-auto"
                                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 120px"
                                        />
                                        <Image
                                            src="/clients/etiqa.svg"
                                            alt="Etiqa"
                                            width={120}
                                            height={40}
                                            className="h-6 md:h-8 w-auto"
                                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 120px"
                                        />
                                        <Image
                                            src="/clients/msig.png"
                                            alt="MSIG"
                                            width={120}
                                            height={40}
                                            className="h-6 md:h-8 w-auto"
                                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 120px"
                                        />
                                        <Image
                                            src="/clients/tokio.svg"
                                            alt="Tokio Marine"
                                            width={140}
                                            height={40}
                                            className="h-8 md:h-10 w-auto"
                                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 140px"
                                        />
                                        <Image
                                            src="/clients/great-eastern.png"
                                            alt="Great Eastern"
                                            width={140}
                                            height={40}
                                            className="h-6 md:h-8 w-auto"
                                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 140px"
                                        />
                                        <Image
                                            src="/clients/amanah.png"
                                            alt="Amanah Ikhtiar"
                                            width={140}
                                            height={60}
                                            className="h-8 md:h-12 w-auto"
                                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 140px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimateOnLoad>
                </div>
            </div>
        </SectionContainer>
    )
}
