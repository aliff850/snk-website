import { NewsArticle } from './newsArticle';

interface NewsArticle {
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
    url: string;
}

const mockNewsArticles: NewsArticle[] = [
    {
        id: "1",
        title: "SNK Launches Next-Generation AI Claims Processing Platform",
        excerpt: "Revolutionary new system reduces claim processing time by 75% while maintaining 99.5% accuracy rates across all vehicle types and damage scenarios.",
        content: "SNK Market Data Research has announced the launch of its latest AI-powered claims processing platform, setting a new standard in the insurtech industry...",
        author: "Nicholas Raj",
        date: "December 15, 2024",
        category: "Technology",
        image: "/services/estimation.png",
        featured: true,
        readTime: "5 min read",
        url: "/"
    }
    // },
    // {
    //     id: "2",
    //     title: "Malaysia's Insurance Industry Embraces Digital Transformation",
    //     excerpt: "New BNM regulations drive adoption of automated claims systems, with SNK leading the charge in digital innovation and customer experience enhancement.",
    //     content: "The Malaysian insurance sector is experiencing unprecedented digital transformation as new regulatory frameworks from Bank Negara Malaysia encourage...",
    //     author: "Nicholas Raj",
    //     date: "December 12, 2024",
    //     category: "Industry News",
    //     image: "/images/g70.jpg",
    //     readTime: "4 min read"
    // },
    // {
    //     id: "3",
    //     title: "SNK Partners with Major Insurers for Regional Expansion",
    //     excerpt: "Strategic partnerships with Allianz, Etiqa, and MSIG enable SNK to expand its insurtech solutions across Southeast Asia, reaching over 2 million customers.",
    //     content: "SNK Market Data Research has secured strategic partnerships with three major insurance providers, marking a significant milestone in the company's...",
    //     author: "Nicholas Raj",
    //     date: "December 10, 2024",
    //     category: "Company News",
    //     image: "/images/mazda.jpg",
    //     readTime: "3 min read"
    // },
    // {
    //     id: "4",
    //     title: "AI-Powered Vehicle Valuation Reaches 95% Accuracy Milestone",
    //     excerpt: "SNK's machine learning algorithms achieve industry-leading accuracy in vehicle damage assessment, revolutionizing the claims estimation process.",
    //     content: "After months of development and testing, SNK's AI-powered vehicle valuation system has achieved a remarkable 95% accuracy rate in damage assessment...",
    //     author: "Nicholas Raj",
    //     date: "December 8, 2024",
    //     category: "Technology",
    //     image: "/services/value.jpg",
    //     readTime: "6 min read"
    // },
    // {
    //     id: "5",
    //     title: "Road Ranger App Surpasses 100,000 Downloads",
    //     excerpt: "SNK's mobile application for roadside assistance and claims reporting reaches a major milestone, demonstrating strong user adoption and satisfaction.",
    //     content: "SNK Market Data Research celebrates a significant achievement as its Road Ranger mobile application surpasses 100,000 downloads across Malaysia...",
    //     author: "Nicholas Raj",
    //     date: "December 5, 2024",
    //     category: "Company News",
    //     image: "/services/roadside.jpg",
    //     readTime: "4 min read"
    // },
    // {
    //     id: "6",
    //     title: "Thailand Insurance Market Adopts SNK's Digital Solutions",
    //     excerpt: "Expansion into Thailand's insurance market brings SNK's innovative claims processing technology to a new region, with promising early adoption rates.",
    //     content: "SNK Market Data Research has successfully launched its digital insurance solutions in Thailand, marking the company's first major expansion outside...",
    //     author: "Nicholas Raj",
    //     date: "December 3, 2024",
    //     category: "International",
    //     image: "/images/g70.jpg",
    //     readTime: "5 min read"
    // },

];

export function NewsGrid() {
    return(
        <section className="w-full bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40 py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                

                {/* <div className="text-center mb-16">
                    <h2 className="text-brand text-4xl md:text-5xl font-bold mb-6">Latest Updates</h2>
                    <p className="text-brand text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Stay informed about the latest developments in insurtech, industry trends, and SNK innovations
                    </p>
                </div> */}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {mockNewsArticles.map((article, index) => (
                        <NewsArticle key={article.id} article={article} index={index} />
                    ))}
                </div>



                {/* <div className="text-center mt-12">
                    <button className="bg-brand text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-hover transition-colors duration-200">
                        Load More Articles
                    </button>
                </div> */}

            </div>
        </section>
    )
}
