import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import Image from 'next/image'
import { Button } from '../ui/button'
import { solutions } from '@/app/data/solutions'

export function SolutionsGrid() {
    return(
        <section className="w-full bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40 min-h-screen justify-center items-center px-4 md:px-12 lg:px-24 py-16 flex flex-col gap-12 font-onest">

            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((solution, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-brand/20 hover:bg-white hover:scale-105 transition-all duration-300 ease-in-out shadow-lg h-full flex flex-col">
                                
                                {/* Image */}
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={solution.image}
                                        alt={solution.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-brand text-xl md:text-2xl font-bold mb-3">{solution.title}</h3>
                                    <p className="text-brand/80 text-sm md:text-base leading-relaxed mb-4 flex-1">{solution.description}</p>
                                    
                                    {/* Features
                                    <div className="mb-4">
                                        <h4 className="text-brand text-sm font-semibold mb-2">Key Features:</h4>
                                        <ul className="space-y-1">
                                            {solution.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-brand-element rounded-full flex-shrink-0"></div>
                                                    <span className="text-brand/70 text-xs md:text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div> */}

                                    {/* Learn More Button */}
                                    {solution.learnMoreUrl && (
                                        <Button variant="secondary" href={solution.learnMoreUrl} className="text-sm">
                                            Learn More
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>
            </div>

            <AnimateOnLoad animation="fade-in-up" delay={400}>
                <div className="w-full max-w-4xl mx-auto text-center">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-brand/20 shadow-lg">
                        <h3 className="text-brand text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Insurance Operations?</h3>
                        <p className="text-brand text-lg mb-6">
                            Contact us today to learn how our solutions can streamline your processes and enhance customer experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-brand text-white py-3 px-8 rounded-xl font-semibold hover:bg-brand-hover transition-colors duration-200">
                                Get Started
                            </button>
                            <button className="border border-brand text-brand py-3 px-8 rounded-xl font-semibold hover:bg-brand hover:text-white transition-colors duration-200">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </AnimateOnLoad>

        </section>
    )
}
