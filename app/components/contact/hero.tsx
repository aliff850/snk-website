import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

export function ContactHero() {
    return(
        <section className="w-full bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-full bg-black/50 pt-32 pb-16 px-2 md:px-12 lg:px-24">
                <div className="text-center flex flex-col gap-6">
                    <AnimateOnLoad animation="fade-in-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                            </svg>
                        </div>
                        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold">
                            Get In Touch
                        </h1>
                    </AnimateOnLoad>
                    
                    <AnimateOnLoad animation="fade-in-up" delay={200}>
                        <p className="text-white text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
                            Ready to transform your insurance operations? Contact our team to learn how SNK&apos;s innovative solutions can streamline your processes and enhance customer experiences.
                        </p>
                    </AnimateOnLoad>

                    {/* <AnimateOnLoad animation="fade-in-up" delay={300}>
                        <div className="flex flex-wrap gap-4 justify-center mt-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                                <span className="text-white font-medium">Expert Consultation</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                                <span className="text-white font-medium">24/7 Support</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/30">
                                <span className="text-white font-medium">Quick Response</span>
                            </div>
                        </div>
                    </AnimateOnLoad> */}
                </div>
            </div>
        </section>
    )
}
