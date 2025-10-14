import AnimateOnLoad from "../../ui/AnimateOnLoad"

interface VideoDisplayComponents {
    filename: string,
}

// Helper function to convert YouTube URL to embed format
function getYouTubeEmbedUrl(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    
    return url;
}

export function PreviewVideo({ filename }: VideoDisplayComponents) {
    const embedUrl = getYouTubeEmbedUrl(filename);
    
    return (
        <section className="w-full flex flex-col justify-center items-center py-8 md:py-16 px-4 md:px-12 lg:px-24 font-onest relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent -z-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-element/5 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-7xl flex flex-col gap-10 md:gap-16">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center gap-2 text-brand-element font-semibold text-sm tracking-wider">
                            <div className="w-8 h-0.5 bg-brand-element"></div>
                            VIDEO DEMO
                            <div className="w-8 h-0.5 bg-brand-element"></div>
                        </div>
                        <h2 className="text-brand text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            See It In Action
                        </h2>
                        <p className="text-brand/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Watch how our solution transforms your workflow in just minutes
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* Video Container */}
                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="relative">                        
                    
                        <VideoComponent url={embedUrl} />
                        
                    </div>
                </AnimateOnLoad>

            </div>
        </section>
    )
}

function VideoComponent({ url }: { url: string }) {
    return (
        <div className="relative w-full aspect-video overflow-hidden rounded-3xl border-2 border-brand/20 shadow-2xl group">

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-brand rounded-tl-3xl opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-brand rounded-br-3xl opacity-50"></div>

            <iframe 
                src={url} 
                className="absolute inset-0 w-full h-full"
                title="Product Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
            />
        </div>
    )
}