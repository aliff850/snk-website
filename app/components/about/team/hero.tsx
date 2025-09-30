import AnimateOnLoad from "@/components/ui/AnimateOnLoad"

export function TeamHero() {

    return(
        <section className="w-full bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest text-white">
            <div className="w-full h-full bg-black/50 px-4 sm:px-12 lg:px-24 py-16 pt-32 flex flex-col gap-4 justify-center items-center">
                <AnimateOnLoad animation="fade-in-up">
                    <h1 className="text-background text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-sm">
                        Our Team
                    </h1>
                </AnimateOnLoad>
                    
                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <p className="text-background text-center text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto drop-shadow-sm leading-relaxed">
                        Discover the team that makes everything in SNK MDR possible
                    </p>
                </AnimateOnLoad>
            </div>

        </section>
    )

}