import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

export function ServicesHero() {
    return(
        <section className="w-full bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest text-white">
            <div className="w-full h-full bg-black/40 px-4 md:px-12 lg:px-24 pt-32 py-16 justify-center items-center">
                <div className="text-center flex flex-col gap-4">
                    <AnimateOnLoad animation="fade-in-up">
                        <h1 className="text-background text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-sm">
                            Our Solutions
                        </h1>
                    </AnimateOnLoad>
                    
                    <AnimateOnLoad animation="fade-in-up" delay={200}>
                        <p className="text-background text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto drop-shadow-sm leading-relaxed">
                        Discover our comprehensive suite of insurtech solutions designed to transform the insurance industry
                        </p>
                    </AnimateOnLoad>
                </div>
            </div>
        </section>
    )
}
