import Image from "next/image"

export function ArticleContent() {

    return(
        <section className="w-full h-full flex flex-col gap-6 text-brand">
            {/* All of these are still placeholders, will set up the required interfaces and props for all these soon to pull actual articles from supabase or something */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-brand">Article Title Goes Here</h1>
                <div className="flex flex-col lg:flex-row justify-between text-sm">
                    <p>By Nicholas Raj</p>
                    <p>December 24th 2024, 8:27PM</p>
                </div>
            </div>
            
            {/* Image here */}
            <div className="relative rounded-3xl w-full h-96 overflow-hidden rounded-3xl border border-brand/50">
                <Image 
                    src="/images/w214.jpg"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    fill
                    alt="Article Image"
                />
            </div>

            <div className="flex flex-col gap-4">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </p>
            </div>
            
            {/* Another section here for tags or to share the article?!?!? */}

        </section>

    )

}