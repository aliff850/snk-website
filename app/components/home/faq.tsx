import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { Accordion, AccordionItemWithContext, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Link from 'next/link';
import { Button } from '../ui/button';

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
            "Our real-time valuation system covers about 80% of private vehicles in Malaysia and extends to commercial vehicles and motorcycles, ensuring reliable market values.",
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
      <section className="bg-brand justify-center items-center px-4 py-8 md:px-12 lg:px-24 md:py-16 font-onest">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            <AnimateOnLoad animation="fade-in-up">
                <div className="text-center text-brand-foreground flex flex-col">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                    Frequently Asked Questions
                    </h2>
                    <p className="text-xl mx-auto">
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
                    className="bg-background rounded-2xl px-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                    <AccordionTrigger className="py-4 group">
                        <span className="text-lg font-semibold text-brand  group-hover:text-xl transition-all duration-300 ease-in-out">
                        {faq.question}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-brand leading-relaxed pb-6">
                        {faq.answer}
                        </p>
                    </AccordionContent>
                    </AccordionItemWithContext>
                </AnimateOnLoad>
                ))}
            </Accordion>
            </div>

            <div className="text-center text-brand-foreground flex flex-col justify-center gap-4 items-center">
                <p className="text-xl mx-auto">
                    Unable find the answer for your question?
                    {/* <Link href="/contact" className="hover:text-brand-element transition-colors duration-200">
                        Contact us directly.
                    </Link>  */}
                </p>
                <Button href="/contact" size="md" className='text-2xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone mr-2"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
                    Contact Us Directly!
                </Button>
            </div>
        </div>
      </section>
    )
  }