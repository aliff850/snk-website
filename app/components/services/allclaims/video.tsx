import AnimateOnLoad from "../../ui/AnimateOnLoad"

export function PreviewVideo() {

    return(
        <section className="w-full bg-white py-16 px-4 md:px-12 lg:px-24 font-onest">
            
            <AnimateOnLoad animation="fade-in-up">
                <div className="text-center mb-16">
                    <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                    
                </div>
            </AnimateOnLoad>

            <div className="w-full h-[560px]">

                <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/5kQHA6uM5yk?si=Z8f4Yt4bPEWnRMlA"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-2xl w-full h-full"
                ></iframe>
            </div>

        </section>
    )

}