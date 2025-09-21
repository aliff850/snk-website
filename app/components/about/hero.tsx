import AnimateOnLoad from "../ui/AnimateOnLoad"

export function AboutHero() {

    return(
        <section className="w-full bg-[url('/images/g70.jpg')] bg-cover bg-center font-onest text-white">
            <div className="w-full h-full backdrop-blur-sm bg-black/20 px-24 pt-30 pb-16 flex flex-col gap-4 flex flex-col justify-center items-center">
                <AnimateOnLoad animation="fade-in-up">
                    <h1 className="text-background text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-sm">
                        About Us
                    </h1>
                </AnimateOnLoad>
                    
                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <p className="text-background text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto drop-shadow-sm leading-relaxed">
                    Learn more regarding the background of SNK MDR
                    </p>
                </AnimateOnLoad>
            </div>

        </section>
    )

}