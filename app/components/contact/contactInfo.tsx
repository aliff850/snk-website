import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

interface ContactInfo {
    icon: React.ReactNode;
    title: string;
    details: string[];
    description?: string;
}

const contactInfo: ContactInfo[] = [
    {
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
            </svg>
        ),
        title: "Head Office",
        details: [
            "SNK Market Data Research Sdn Bhd",
            "Level 15, Menara 2, KL Sentral",
            "50470 Kuala Lumpur, Malaysia"
        ],
        description: "Our main headquarters in the heart of Kuala Lumpur's business district"
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
            </svg>
        ),
        title: "Phone",
        details: [
            "+60 3-2274 8888",
            "+60 12-345 6789",
            "Emergency: +60 12-999 8888"
        ],
        description: "Available 24/7 for urgent support and assistance"
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4M20 8L12 13L4 8V6L12 11L20 6V8Z"/>
            </svg>
        ),
        title: "Email",
        details: [
            "info@snkmdr.com",
            "support@snkmdr.com",
            "sales@snkmdr.com"
        ],
        description: "We respond to all inquiries within 24 hours"
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12.5 7H13V13L16.2 16.2L15.1 17.3L11.5 13.7V7H12.5Z"/>
            </svg>
        ),
        title: "Business Hours",
        details: [
            "Monday - Friday: 8:00 AM - 6:00 PM",
            "Saturday: 9:00 AM - 1:00 PM",
            "Sunday: Closed"
        ],
        description: "24/7 technical support available for existing clients"
    }
];

export function ContactInfo() {
    return(
        <section className="w-full bg-brand py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center mb-16">
                        <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">Contact Information</h2>
                        <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                            Get in touch with our team through any of the channels below. We&apos;re here to help you succeed.
                        </p>
                    </div>
                </AnimateOnLoad>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contactInfo.map((info, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 ease-in-out h-full flex flex-col">
                                
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-element rounded-2xl mb-6 text-white">
                                    {info.icon}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-brand text-xl md:text-2xl font-bold mb-4">{info.title}</h3>
                                    <div className="space-y-2 mb-4">
                                        {info.details.map((detail, detailIndex) => (
                                            <p key={detailIndex} className="text-brand text-base leading-relaxed">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                    {info.description && (
                                        <p className="text-brand/70 text-sm leading-relaxed italic">
                                            {info.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>

                {/* Quick Contact Actions */}
                {/* <AnimateOnLoad animation="fade-in-up" delay={400}>
                    <div className="mt-16 bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
                        <div className="text-center mb-8">
                            <h3 className="text-brand text-2xl md:text-3xl font-bold mb-4">Quick Actions</h3>
                            <p className="text-brand text-lg">Choose the most convenient way to reach us</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <a 
                                href="tel:+60322748888"
                                className="bg-brand text-white p-6 rounded-2xl text-center hover:bg-brand-hover transition-colors duration-200 group"
                            >
                                <svg className="w-8 h-8 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                                </svg>
                                <h4 className="font-bold mb-2">Call Now</h4>
                                <p className="text-sm opacity-90">+60 3-2274 8888</p>
                            </a>
                            
                            <a 
                                href="mailto:info@snkmdr.com"
                                className="bg-brand-element text-white p-6 rounded-2xl text-center hover:bg-brand-element/80 transition-colors duration-200 group"
                            >
                                <svg className="w-8 h-8 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4M20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                                </svg>
                                <h4 className="font-bold mb-2">Send Email</h4>
                                <p className="text-sm opacity-90">info@snkmdr.com</p>
                            </a>
                            
                            <button className="bg-white text-brand border-2 border-brand p-6 rounded-2xl text-center hover:bg-brand hover:text-white transition-colors duration-200 group">
                                <svg className="w-8 h-8 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/>
                                </svg>
                                <h4 className="font-bold mb-2">Schedule Meeting</h4>
                                <p className="text-sm opacity-90">Book a consultation</p>
                            </button>
                        </div>
                    </div>
                </AnimateOnLoad> */}

            </div>
        </section>
    )
}
