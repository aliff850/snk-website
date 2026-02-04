import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
// import Image from 'next/image';
import SectionContainer from '../../ui/SectionContainer'
import ImageGallery from '@/components/ui/ImageGallery'

interface ProductOverviewAltProps {
    overview: string,
    image?: string
    alt: string,
    galleryImages?: { src: string; alt?: string }[]
}

export function ProductOverviewAlt({ overview, image, alt, galleryImages }: ProductOverviewAltProps) {
    return (
        <SectionContainer variant="brand-bg">
            <div className="w-full h-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-4 lg:gap-6 justify-center items-stretch h-full">

                    {/* Content */}
                    <AnimateOnLoad animation="fade-in-left">
                        <div className="flex flex-col gap-4 md:gap-6">
                            {/* <h2 className="text-brand text-center text-4xl md:text-5xl font-bold">{title}</h2> */}
                            <p className="text-brand text-base  leading-relaxed" dangerouslySetInnerHTML={{ __html: overview }}>
                            </p>
                        </div>
                    </AnimateOnLoad>

                    {/* Visual */}
                    <AnimateOnLoad animation="fade-in-right">
                        <div className="w-full flex">
                            {(() => {
                                const slides = galleryImages && galleryImages.length > 0
                                    ? galleryImages
                                    : (image ? [{ src: image, alt }] : []);
                                return slides.length > 0 ? (
                                    <ImageGallery
                                        images={slides}
                                        intervalMs={3500}
                                        className="w-full"
                                        aspectClassName="aspect-[16/9]"
                                    />
                                ) : null;
                            })()}
                        </div>
                    </AnimateOnLoad>
                </div>
            </div>
        </SectionContainer>
    )
}
