import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '../ui/button'
import { solutions } from '@/app/data/solutions'
import { ValuationBanner } from './valuationSection'
import { LucideAArrowDown } from 'lucide-react'

export function SolutionsGrid() {
    return (
        <section className="w-full min-h-svh justify-center items-center px-4 md:px-24 py-8 md:py-12 flex flex-col gap-4 md:gap-6 font-onest">

            <ValuationBanner />

            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {solutions.map((solution, index) => (
                        <AnimateOnLoad
                            key={index}
                            animation="fade-in-up"
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-brand-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-brand/20 hover:bg-brand-white hover:ring-brand hover:scale-105 transition-all duration-500 ease-in-out shadow-lg h-full flex flex-col text-center md:text-left group">

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
                                    <div className="opacity-20 group-hover:opacity-100 duration-500 transition-all absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-4 md:p-6 flex-1 flex flex-col gap-2 md:gap-4">
                                    <h3 className="text-brand text-xl md:text-2xl font-bold">{solution.title}</h3>
                                    <p className="text-brand/80 text-sm md:text-base leading-relaxed flex-1">{solution.description}</p>

                                    {/* Learn More Button */}
                                    {solution.learnMoreUrl && (
                                        <Button variant="secondary" size="sm" href={solution.learnMoreUrl} className="md:text-xl flex items-center gap-2">
                                            Learn More <ArrowUpRight />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>
            </div>

            <AnimateOnLoad animation="fade-in-up" delay={400}>
                <div className="w-full mx-auto text-center">
                    <div className="bg-brand-white/95 rounded-2xl md:rounded-3xl px-4 md:px-16 py-4 md:py-8 ring-1 ring-brand/20 hover:ring-brand duration-500 transition-ring shadow-lg">
                        <h3 className="text-brand text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Insurance Operations?</h3>
                        <p className="text-brand md:text-lg mb-6">
                            Contact us today to learn how our solutions can streamline your processes and enhance customer experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="md" variant="secondary" href="/contact" className="flex md:text-xl gap-2">
                                Get Started <ArrowRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </AnimateOnLoad>

        </section>
    )
}
