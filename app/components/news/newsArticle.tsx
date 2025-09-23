import Image from 'next/image';
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface NewsArticleProps {
    article: {
        id: string;
        title: string;
        excerpt: string;
        content: string;
        author: string;
        date: string;
        category: string;
        image: string;
        featured?: boolean;
        readTime: string;
    };
    index: number;
}

export function NewsArticle({ article, index }: NewsArticleProps) {
    const animationDelay = (index * 100 + 200) as 0 | 100 | 200 | 300 | 400;
    
    return (
        <AnimateOnLoad animation="fade-in-up" delay={animationDelay}>
            <article className={`bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-brand/20 hover:bg-white hover:scale-105 transition-all duration-300 ease-in-out shadow-lg h-full flex flex-col group ${
                article.featured ? 'md:col-span-2' : ''
            }`}>
                
                {/* Image */}
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t group-hover:from-brand/30 to-transparent transition-all duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-brand-element text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {article.category}
                        </span>
                    </div>

                    {/* Featured Badge */}
                    {article.featured && (
                        <div className="absolute top-4 right-4">
                            <span className="bg-brand text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Featured
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-brand font-bold mb-3 text-xl md:text-2xl">
                            {article.title}
                        </h3>
                        <p className="text-brand/80 text-sm md:text-base leading-relaxed mb-4 flex-1">
                            {article.excerpt}
                        </p>
                    </div>
                    
                    {/* Meta Information */}
                    <div className="border-t border-brand/10 pt-4 mt-4">
                        <div className="flex items-center justify-between text-sm text-brand/70 mb-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                                </svg>
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12.5 7H13V13L16.2 16.2L15.1 17.3L11.5 13.7V7H12.5Z"/>
                                </svg>
                                <span>{article.readTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-brand/60 text-sm">{article.date}</span>
                            <button className="text-brand-element hover:text-brand font-semibold text-sm transition-colors duration-200">
                                Read More →
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </AnimateOnLoad>
    );
}
