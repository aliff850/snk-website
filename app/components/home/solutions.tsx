import { SolutionCard } from "../ui/solutionCard"
import { Button } from "../ui/button"

export function SolutionsSection() {

    return(

        <section className="w-full bg-brand min-h-screen justify-center items-center px-24 py-16 flex flex-col gap-8 font-onest text-white">
            <div className="flex flex-col text-center gap-4">
                <h1 className="text-6xl font-bold text-background">Our Solutions</h1>
                <p className="text-xl">Discover our innovative Insurtech solutions designed to simplify claims, streamline processes, and make insurance faster, smarter, and more accessible for everyone.</p>
            </div>

            <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SolutionCard 

                    title="AllClaims"
                    description="Accurate vehicle claims estimates in minutes."
                    learnMoreUrl="/services/allclaims"
                    image="services/estimation.png"
                
                />
                <SolutionCard 

                    title="Road Ranger"
                    description="End-to-end accident and claims management platform."
                    learnMoreUrl="/"
                    image="services/towtruck.jpg"
                
                />
                <SolutionCard 

                    title="Digital Marketing Platform"
                    description="Buy and issue insurance policies instantly, anytime."
                    learnMoreUrl="/"
                    image="services/policy.jpg"
                
                />
                <SolutionCard 

                    title="Road Ranger App"
                    description="Roadside help, accident reporting, and repair estimates on the go."
                    learnMoreUrl="/"
                    image="services/roadside.jpg"
                
                />
                <SolutionCard 

                    title="Real-Time Online Vehicle Valuation"
                    description="Instant, reliable valuations for cars, bikes, and commercial vehicles."
                    learnMoreUrl="/"
                    image="services/value.jpg"
                
                />
                <SolutionCard 

                    title="Claims Online Estimation"
                    description="Accurate accident damage estimates in minutes."
                    learnMoreUrl="/"
                    image="images/g70.jpg"
                
                />
            </div>

            <Button 
                href="/services"
                variant="primary"
                size="sm"
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
            
        </section>

    
    )

}