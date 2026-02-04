import { SolutionCard } from "../ui/solutionCard"
import { Button } from "../ui/button"
import AnimateOnLoad from "../ui/AnimateOnLoad"
import { solutions } from "@/app/data/solutions"
import SectionContainer from "@/components/ui/SectionContainer"

export function SolutionsSection() {

    return (
        <SectionContainer variant="brand">

            <div className="w-full max-w-7xl flex flex-col justify-center items-center gap-4 md:gap-6">

                <div className="flex flex-col text-center gap-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-background">Our Solutions</h1>
                    <p className="md:text-lg">Discover our innovative Insurtech solutions designed to simplify claims, streamline processes, and make insurance faster, smarter, and more accessible for everyone.</p>
                </div>

                <div className="w-full max-w-7xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                    {solutions.map((solution, index) => (

                        <AnimateOnLoad
                            key={index}
                            animation="fade-in-up"
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >

                            <SolutionCard
                                title={solution.title}
                                description={solution.description}
                                learnMoreUrl={solution.learnMoreUrl}
                                image={solution.image}
                            />


                        </AnimateOnLoad>

                    ))}


                </div>

                <Button
                    href="/services"
                    variant="primary"
                    size="md"
                    className="text-xl">
                    Explore All Our Solutions
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
        </SectionContainer>
    )
}