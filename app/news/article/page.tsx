import { ArticleHero } from "@/app/components/news/article/hero"
import { ArticleLayout } from "@/app/components/news/article/_layout"

export default function ArticleTemplate() {

    return(
        <div className="min-h-screen">
            <ArticleHero />
            <ArticleLayout />
        </div>
    )

}