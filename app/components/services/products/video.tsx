import AnimateOnLoad from "../../ui/AnimateOnLoad"
import { Suspense } from "react"
import { list } from "@vercel/blob"

interface VideoDisplayComponents {
    filename: string,
}


export function PreviewVideo(
    {filename}:VideoDisplayComponents) {
    return(

        <section className="w-full flex flex-col justify-center items-center py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl flex flex-col gap-8">

                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center">
                        <h2 className="text-brand text-4xl md:text-5xl font-bold">How It Works</h2>
                    </div>
                </AnimateOnLoad>

                <Suspense fallback={<p>Loading video...</p>}>
                    <VideoComponent fileName={filename} />
                </Suspense>

            </div>

        </section>
    )

}

async function VideoComponent({ fileName }: { fileName: string }) {
    const { blobs } = await list({
      prefix: fileName,
      limit: 1,
    })
    if (!blobs || blobs.length === 0) {
      return <p>Video not found.</p>
    }
    const { url } = blobs[0]
   
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-3xl">
        <video controls preload="none" aria-label="Video player" className="absolute inset-0 w-full h-full object-contain">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }