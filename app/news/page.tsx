import { NewsHero } from '@/components/news/hero';
import { NewsGrid } from '@/components/news/newsGrid';

export default function News() {
    return(
        <div className="min-h-screen">
            <NewsHero />
            <NewsGrid />
        </div>
    )
}