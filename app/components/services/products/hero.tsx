import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface ProductHeroProps {
    title: string;
    caption: string;
    backgroundImage?: string;
}

export function ProductHero({ title, caption, backgroundImage = '/services/estimation.png' }: ProductHeroProps) {
    return(
        <section 
            className="w-full bg-cover bg-center font-onest text-white"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-full h-full bg-black/50 px-4 md:px-12 lg:px-24 pt-32 pb-24 flex flex-col gap-8 justify-center items-center">
                <div className="text-center flex flex-col gap-6">
                    <AnimateOnLoad animation="fade-in-up">
                        {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
                            </svg>
                        </div> */}
                        <h1 className="text-brand-element text-4xl md:text-6xl font-bold drop-shadow-lg">
                            {title}
                        </h1>
                    </AnimateOnLoad>
                    
                    <AnimateOnLoad animation="fade-in-up" delay={200}>
                        <p className="text-white text-lg md:text-xl max-w-4xl mx-auto drop-shadow-lg leading-relaxed">
                            {caption}
                        </p>
                    </AnimateOnLoad>

                    {/* <AnimateOnLoad animation="fade-in-up" delay={300}>
                        <div className="flex flex-wrap gap-4 justify-center mt-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                                <span className="text-white font-medium">AI-Powered</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                                <span className="text-white font-medium">Real-Time</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                                <span className="text-white font-medium">Accurate</span>
                            </div>
                        </div>
                    </AnimateOnLoad> */}
                </div>
            </div>
        </section>
    )
}
