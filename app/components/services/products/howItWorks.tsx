import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import ImageGallery from '../../ui/ImageGallery';

interface ProductOverviewProps{
    title:string,
    caption:string,
    image?:string
    alt:string,
    galleryImages?: { src: string; alt?: string }[]
}

export function HowItWorks({ title, caption, image, alt, galleryImages }:ProductOverviewProps) {
    return(
        <section className="w-full py-8 md:py-16 px-4 md:px-12 lg:px-24 font-onest relative overflow-hidden">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-16">

                {/* Content Section */}
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Title Element */}
                        <div className="inline-flex items-center justify-center gap-2 text-brand-element font-semibold text-sm tracking-wider mx-auto mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-element to-transparent"></div>
                            HOW IT WORKS
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-element to-transparent"></div>
                        </div>

                        <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h2>
                        <p className="text-brand/70 md:text-xl leading-relaxed">
                            {caption}
                        </p>
                    </div>
                </AnimateOnLoad>
                
                {/* Visual Section */}
                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="relative">

                        {/* Main Image/Gallery Container */}
                        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-brand shadow-lg group">
                                                            
                            {(() => {
                                const slides = galleryImages && galleryImages.length > 0
                                    ? galleryImages
                                    : (image ? [{ src: image, alt }] : []);
                                return slides.length > 0 ? (
                                    <ImageGallery
                                        images={slides}
                                        autoPlay={false}
                                        intervalMs={5500}
                                        className="w-full"
                                        aspectClassName="aspect-[16/9]"
                                    />
                                ) : null;
                            })()}
                        </div>

                    </div>
                </AnimateOnLoad>

            </div>
        </section>
    )
}
