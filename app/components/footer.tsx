import Link from "next/link";
import SectionContainer from "./ui/SectionContainer";
import { MapPin, Mail, PhoneCall, ArrowRight } from "lucide-react";

export function Footer() {

    return (
        <footer className="border-t border-t-brand-element">
            <SectionContainer variant="brand">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">

                        {/* About Us Section */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-6 text-center md:text-left text-white">About SNK</h3>
                            <p className="text-brand-foreground text-sm text-center md:text-justify leading-relaxed mb-6 max-w-lg">
                                We are Malaysia's leading Insurtech provider with 25 years of experience in motor vehicle valuation and insurance claims solutions. Trusted by top insurers, we deliver innovative digital platforms that make insurance simple, fast, and accessible for everyone.
                            </p>
                            <div className="w-full md:w-fit flex justify-center space-x-2 md:space-x-4">
                                {/* <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                                    <span className="text-white font-bold">f</span>
                                </div> */}
                                <Link
                                    href="https://www.linkedin.com/company/snkmarketdata/"
                                    target="_blank"
                                    className="relative w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:w-40 transition-all duration-300 group overflow-hidden"
                                >
                                    <span className="absolute text-white font-bold transition-opacity duration-300 group-hover:opacity-0">
                                        in
                                    </span>
                                    <span className="flex items-center opacity-0 group-hover:opacity-100 text-white font-bold transition-opacity duration-300 whitespace-nowrap px-4">
                                        LinkedIn
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </span>
                                </Link>
                                {/* <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                                    <span className="text-white font-bold">t</span>
                                </div> */}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-2 md:mb-6 text-white">Our Solutions</h3>
                            <ul className="items-center text-sm space-y-2 md:space-y-3">
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
                            <h3 className="text-xl font-bold mb-2 md:mb-6 text-white">Contact Info</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3 group">
                                    <PhoneCall className="w-5 h-5 text-brand-foreground flex-shrink-0 transition-colors group-hover:text-white" />
                                    <span className="text-brand-foreground group-hover:text-white transition-colors">+603-8068-9409</span>
                                </div>
                                <div className="flex items-start gap-3 group">
                                    <Mail className="w-5 h-5 text-brand-foreground flex-shrink-0 transition-colors group-hover:text-white" />
                                    <span className="text-brand-foreground group-hover:text-white transition-colors">information@snkmdr.com</span>
                                </div>
                                <div className="flex items-start gap-3 group">
                                    <MapPin className="w-5 h-5 text-brand-foreground flex-shrink-0 transition-colors group-hover:text-white" />
                                    <span className="text-brand-foreground group-hover:text-white transition-colors">
                                        SNK Market Data Research SB, 11A-2, Jalan USJ1/1A, Regalia Business Center
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-white/20 py-4 md:py-8 text-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-brand-foreground">
                                © 2025 SNK Market Data Research. All rights reserved.
                            </p>
                            <div className="w-full md:w-fit flex flex-col gap-2 md:flex-row md:space-x-8">
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

                    {/* <div className="border-t border-white/20 pt-4 text-center">
                <p className="text-xs text-brand-foreground/60">Developed by OnlySoft</p>
            </div> */}
                </div>
            </SectionContainer>
        </footer>
    )

}