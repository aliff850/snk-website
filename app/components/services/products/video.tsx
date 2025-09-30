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
    
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    
    // If it's not a valid YouTube URL, return the original
    return url;
}

export function PreviewVideo({ filename }: VideoDisplayComponents) {
    const embedUrl = getYouTubeEmbedUrl(filename);
    
    return (
        <section className="w-full flex flex-col justify-center items-center py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl flex flex-col gap-8">
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center">
                        <h2 className="text-brand text-4xl md:text-5xl font-bold">How It Works</h2>
                    </div>
                </AnimateOnLoad>

                <VideoComponent url={embedUrl} />
            </div>
        </section>
    )
}

function VideoComponent({ url }: { url: string }) {
    return (
        <div className="relative w-full aspect-video overflow-hidden rounded-3xl">
            <iframe 
                src={url} 
                className="absolute inset-0 w-full h-full"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
            />
        </div>
    )
}