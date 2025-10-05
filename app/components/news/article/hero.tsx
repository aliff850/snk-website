import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

export function ArticleHero() {
    return(
        <section className="w-full bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest text-white">
            <div className="w-full h-full bg-black/40 px-4 md:px-12 lg:px-24 pt-38 pb-24 flex flex-col gap-8 justify-center items-center">
                <div className="text-center flex flex-col gap-6">
                    <AnimateOnLoad animation="fade-in-up">
                        {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 6H2V4C2 2.9 2.9 2 4 2H6V4H4V6M20 2H18V4H20V6H22V4C22 2.9 21.1 2 20 2M4 18H2V20C2 21.1 2.9 22 4 22H6V20H4V18M20 20H18V22H20C21.1 22 22 21.1 22 20V18H20V20M12 8C8.69 8 6 10.69 6 14S8.69 20 12 20 18 17.31 18 14 15.31 8 12 8M12 18C9.79 18 8 16.21 8 14S9.79 10 12 10 16 11.79 16 14 14.21 18 12 18M12 12C10.9 12 10 12.9 10 14S10.9 16 12 16 14 15.1 14 14 13.1 12 12 12Z"/>
                            </svg>
                        </div> */}
                        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
                            Latest News
                        </h1>
                    </AnimateOnLoad>
                    

                </div>
            </div>
        </section>
    )
}
