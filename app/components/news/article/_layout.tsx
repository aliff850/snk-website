import { ArticleContent } from "./content"
import { FeaturedGrid } from "./featuredArticle"
import { Button } from "../../ui/button"

export function ArticleLayout() {

    return(

        <section className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40 py-16 px-4 md:px-12 lg:px-24 font-onest">

            {/* Main content column */}
            <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-12">

                <div className="lg:col-span-3">
                    {/* Replace this with actual article content */}
                    <ArticleContent />
                </div>

            {/* Sidebar with other articles */}

                <div className="h-full flex flex-col gap-4 lg:col-span-1">

                    <h2 className="text-2xl lg:text-3xl font-bold text-brand">Other Articles</h2>

                    <div className="grid grid-rows gap-4">
                        {/* Replace these with actual article items from the DB or something later */}
                        <FeaturedGrid />
                        <FeaturedGrid />
                        <FeaturedGrid />
                    </div>

                    <Button href="/news" className="flex gap-2" variant="secondary">
                        View All 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Button>
                    
                </div>
                
            </div>

        </section>

    )

}