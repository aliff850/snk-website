import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import { Accordion, AccordionItemWithContext, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import SectionContainer from '@/components/ui/SectionContainer'
// import Link from 'next/link';
import { Button } from '../ui/button'
import { Phone } from 'lucide-react'

export function FAQSection() {
    const faqs = [
        {
            question: "What services do you provide?",
            answer:
                "We offer digital solutions for motor insurance, including claims processing, vehicle valuation, roadside assistance, and online insurance policy platforms.",
        },
        {
            question: "Who can use your systems?",
            answer:
                "Our platforms are built for insurers, adjusters, workshops, and the general public—making insurance faster and more accessible for everyone.",
        },
        {
            question: "How accurate are your vehicle valuations?",
            answer:
                "Our real-time valuation system covers about 99% of private vehicles in Malaysia and extends to commercial vehicles and motorcycles, ensuring reliable market values.",
        },
        {
            question: "Do you provide roadside assistance?",
            answer:
                "Yes, through the Road Ranger app, customers can request towing, accident reporting, repair estimates, and emergency help anytime, anywhere.",
        },
        {
            question: "How do insurers benefit from your solutions?",
            answer:
                "Insurers gain faster claims processing, reduced fraud risk, improved customer experience, and a streamlined end-to-end digital ecosystem.",
        },

    ]

    return (
        <SectionContainer variant="brand">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center text-brand-foreground flex flex-col">
                        <h2 className="text-4xl md:text-5xl font-bold mb-2 md:mb-6">
                            Frequently Asked Questions
                        </h2>
                        <p className="md:text-lg">
                            Get answers to common questions about our vehicle valuation services and process.
                        </p>
                    </div>
                </AnimateOnLoad>

                <div className="w-full">
                    <Accordion type="single" collapsible className="flex flex-col gap-4">
                        {faqs.map((faq, index) => (
                            <AnimateOnLoad key={faq.question} animation="fade-in-up">
                                <AccordionItemWithContext
                                    value={`item-${index}`}
                                    className="bg-background rounded-2xl px-4 md:px-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <AccordionTrigger className="py-4 md:py-4 group">
                                        <span className="font-semibold text-brand group-hover:text-lg transition-all duration-300 ease-in-out">
                                            {faq.question}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-brand leading-relaxed pb-4 md:pb-6">
                                            {faq.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItemWithContext>
                            </AnimateOnLoad>
                        ))}
                    </Accordion>
                </div>

                <div className="text-center text-brand-foreground flex flex-col justify-center gap-4 items-center">
                    <p className="text-base md:text-lg mx-auto">
                        Unable find the answer for your question?
                        {/* <Link href="/contact" className="hover:text-brand-element transition-colors duration-200">
                        Contact us directly.
                    </Link>  */}
                    </p>
                    <Button href="/contact" size="md" className='text-lg md:text-xl flex gap-2'>
                        Contact Us Directly
                        <Phone />
                    </Button>
                </div>
            </div>
        </SectionContainer>
    )
}