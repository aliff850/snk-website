import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import Image from 'next/image';

interface ProductOverviewProps{
    title:string,
    overview:string,
    image:string
    alt:string,
}

export function ProductOverview({ title, overview, image, alt }:ProductOverviewProps) {
    return(
        <section className="w-full py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full h-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-center items-stretch h-full">
                    
                    {/* Content */}
                    <AnimateOnLoad animation="fade-in-left">
                        <div className="space-y-6">
                            <h2 className="text-brand text-4xl md:text-5xl font-bold">{title}</h2>
                            <p className="text-brand text-sm md:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: overview }}>
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
                    {/* Maybe replace this with a small image gallery that either scrolls through automatically or the user can go through themselves instead of just a single image */}
                    <AnimateOnLoad animation="fade-in-right">
                        <div className="h-96 flex">
                            <div className="relative w-full h-full rounded-3xl overflow-hidden group border border-brand/50">
                                <Image 
                                    src={image} 
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                    alt={alt}
                                />
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
