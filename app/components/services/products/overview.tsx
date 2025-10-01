import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import Image from 'next/image';
import ImageGallery from '@/components/ui/ImageGallery';

interface ProductOverviewProps{
    title:string,
    overview:string,
    image?:string
    alt:string,
    galleryImages?: { src: string; alt?: string }[]
}

export function ProductOverview({ title, overview, image, alt, galleryImages }:ProductOverviewProps) {
    return(
        <section className="w-full py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full h-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-8 justify-center items-stretch h-full">
                    
                    {/* Content */}
                    <AnimateOnLoad animation="fade-in-left">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-brand text-center text-4xl md:text-5xl font-bold">{title}</h2>
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
                    <AnimateOnLoad animation="fade-in-right">
                        <div className="h-72 md:h-80 lg:h-96 flex">
                            {(() => {
                                const slides = galleryImages && galleryImages.length > 0
                                    ? galleryImages
                                    : (image ? [{ src: image, alt }] : []);
                                return slides.length > 0 ? (
                                    <ImageGallery
                                        images={slides}
                                        intervalMs={3500}
                                        className="w-full h-full"
                                    />
                                ) : null;
                            })()}
                        </div>
                    </AnimateOnLoad>

                </div>
            </div>
        </section>
    )
}
