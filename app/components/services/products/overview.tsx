import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import Image from 'next/image';

interface ProductOverviewProps{
    overview:string,
    image:string,
}

export function ProductOverview({ overview, image }:ProductOverviewProps) {
    return(
        <section className="w-full py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full h-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-center items-stretch h-full">
                    
                    {/* Content */}
                    <AnimateOnLoad animation="fade-in-left">
                        <div className="space-y-6">
                            {/* <h2 className="text-brand text-4xl md:text-5xl font-bold">Revolutionary Damage Assessment</h2> */}
                            <p className="text-brand text-lg md:text-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: overview }}>
                            </p>
                            {/* <p className="text-brand/80 text-base md:text-lg leading-relaxed">
                                {overview}
                            </p> */}
                            
                            {/* Key Stats */}
                            {/* <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-brand/20 shadow-lg">
                                    <div className="text-brand text-3xl font-bold mb-2">95%</div>
                                    <div className="text-brand text-sm font-medium">Accuracy Rate</div>
                                </div>
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-brand/20 shadow-lg">
                                    <div className="text-brand text-3xl font-bold mb-2">5 min</div>
                                    <div className="text-brand text-sm font-medium">Average Processing</div>
                                </div>
                            </div> */}
                        </div>
                    </AnimateOnLoad>

                    {/* Visual */}
                    <AnimateOnLoad animation="fade-in-right">
                        <div className="h-full flex">
                            <div className="relative h-full w-full rounded-4xl overflow-hidden group border border-brand/50">
                                <Image src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" fill alt="AllClaims Damage Assessment Interface"/>
                            </div>
                        </div>
                        {/* <div className="relative h-96 bg-gradient-to-br from-brand-element/10 to-brand/10 rounded-3xl overflow-hidden border border-brand/20 shadow-lg">
                            <Image
                                src="/services/estimation.png"
                                alt="AllClaims Damage Assessment Interface"
                                fill
                                className="object-cover rounded-3xl"
                                priority
                            />
                        </div> */}

                    </AnimateOnLoad>

                </div>
            </div>
        </section>
    )
}
