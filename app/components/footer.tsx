import Link from "next/link";

export function Footer() {

    return(
    <footer className="bg-brand text-brand-foreground font-onest border-t border-t-brand-element px-4 py-8 md:px-12 lg:px-24 md:py-16">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                {/* About Us Section */}
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold mb-6 text-white">About SNK</h3>
                    <p className="text-brand-foreground leading-relaxed mb-6 max-w-lg">
                        We are Malaysia&apos;s leading Insurtech provider with 25 years of experience in motor vehicle valuation and insurance claims solutions. Trusted by top insurers, we deliver innovative digital platforms that make insurance simple, fast, and accessible for everyone.
                    </p>
                    <div className="flex space-x-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                            <span className="text-white font-bold">f</span>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                            <span className="text-white font-bold">in</span>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                            <span className="text-white font-bold">t</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-6 text-white">Our Solutions</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/services/allclaims" className="text-brand-foreground hover:text-brand-element transition-colors duration-200">
                                COLS Investigation
                            </Link>
                        </li>
                        <li>
                            <Link href="/services/valuation" className="text-brand-foreground hover:text-brand-element transition-colors duration-200">
                                Vehicle Valuation
                            </Link>
                        </li>
                        <li>
                            <Link href="/services/estimation" className="text-brand-foreground hover:text-brand-element transition-colors duration-200">
                                Accident Estimation
                            </Link>
                        </li>
                        <li>
                            <Link href="/services/mymotorpal" className="text-brand-foreground hover:text-brand-element transition-colors duration-200">
                                MyMotorPal
                            </Link>
                        </li>
                        <li>
                            <Link href="/services/roadranger" className="text-brand-foreground hover:text-brand-element transition-colors duration-200">
                                Road Ranger
                            </Link>
                        </li>
                        <li>
                            <Link href="/services/online-insurance" className="text-brand-foreground hover:text-brand-element transition-colors duration-200">
                                Online Insurance Platform
                            </Link>
                        </li>
                    </ul>
                </div>


                <div>
                    <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </div>
                            <span className="text-brand-foreground">+603-8068-9409</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <span className="text-brand-foreground">information@snkmdr.com</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-brand-foreground">
                                Subang Jaya,<br />
                                Selangor
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/20 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-brand-foreground">
                        © 2025 SNK Market Data Research. All rights reserved.
                    </p>
                    <div className="flex space-x-8">
                        <Link href="/privacy" className="text-brand-foreground hover:text-white transition-colors duration-200">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-brand-foreground hover:text-white transition-colors duration-200">
                            Terms of Service
                        </Link>
                        <Link href="/contact" className="text-brand-foreground hover:text-white transition-colors duration-200">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    )
    
}