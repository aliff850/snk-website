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
        <section className="w-full py-8 md:py-16 px-4 md:px-12 lg:px-24 font-onest relative overflow-hidden">

            <div className="w-full h-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-4 md:gap-16 justify-center items-stretch h-full">
                    
                    {/* Content Section */}
                    <AnimateOnLoad animation="fade-in-up">
                        <div className="flex flex-col gap-4 md:gap-8 text-center max-w-5xl mx-auto">
                            {/* Decorative Element */}
                            <div className="inline-flex items-center justify-center gap-2 text-brand-element font-semibold text-sm tracking-wider mx-auto">
                                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-element to-transparent"></div>
                                OVERVIEW
                                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-element to-transparent"></div>
                            </div>

                            <h2 className="text-brand text-4xl md:text-5xl font-bold leading-tight">
                                {title}
                            </h2>
                            
                            <div className="relative">
                                <p 
                                    className="text-brand/80 text-base md:text-lg leading-relaxed" 
                                    dangerouslySetInnerHTML={{ __html: overview }}
                                />
                            </div>

                        </div>
                    </AnimateOnLoad>

                    {/* Slides Section */}
                    <AnimateOnLoad animation="fade-in-up" delay={200}>
                        <div className="relative h-[240px] md:h-[650px]">

                            {/* Main Image/Gallery Container */}
                            <div className="relative h-full rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-brand shadow-lg group">
                                                                
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

                        </div>
                    </AnimateOnLoad>
                </div>
            </div>
        </section>
    )
}