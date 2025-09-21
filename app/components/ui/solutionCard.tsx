import { Button } from "./button"

interface solutionCardProps {
    image: string,
    title: string,
    description: string,
    learnMoreUrl?: string,
}

export function SolutionCard({
    image,
    title,
    description,
    learnMoreUrl = "#"
}:solutionCardProps) {

    return (
        <div className="group relative h-80 w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-105">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
                // FAISAL I USED AI FOR THIS PART!!!!!!!
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 group">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg group-hover:opacity-0 transition-all duration-300">
                    {title}
                </h2>
            </div>
            
            {/* Sliding Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/95 via-brand-element/90 to-brand/95 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="flex flex-col justify-center items-center h-full p-8 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                        {title}
                    </h3>
                    <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-sm">
                        {description}
                    </p>
                    <Button 
                        href={learnMoreUrl}
                        variant="primary"
                        size="sm"
                    >
                        Learn More
                        <svg 
                            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    )
}