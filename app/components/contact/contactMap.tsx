import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineSmartphone } from "react-icons/md";


export function ContactMap() {
    return(
        <section className="w-full bg-brand py-8 md:py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-8">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center flex flex-col gap-2 md:gap-4">
                        <h2 className="text-white text-4xl md:text-5xl font-bold">Contact Information</h2>
                        <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                            Get in touch with our team through any of the channels below, or visit our office.
                        </p>
                    </div>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                        
                        {/* Map Container */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg">
                            <div className="relative h-96 rounded-2xl overflow-hidden">
                                {/* Embedded Google Map */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.147271947839!2d101.60230421013858!3d3.055232053710793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b7e110271ed%3A0x109070cfb4975093!2sSNK%20Market%20Data%20Research!5e0!3m2!1sen!2smy!4v1758439812496!5m2!1sen!2smy"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="SNK Market Data Research Office Location"
                                    className="rounded-xl"
                                ></iframe>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="flex flex-col gap-4 md:gap-6">

                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 md:p-8 border border-white/20 shadow-lg">
                                   
                                <div className="flex flex-col gap-4">

                                    <div className="text-2xl flex items-center space-x-3 text-brand">
                                        <MdOutlineSmartphone />
                                        <h3 className="font-bold">Contact Details</h3>
                                    </div>                                   
                                   
                                    <div className="flex flex-col gap-2 text-brand">
                                        <div className="flex items-center space-x-3 text-brand">

                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            <span>+603-8068-9409</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-brand">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <span>information@snkmdr.com</span>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>

                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 md:p-8 border border-white/20 shadow-lg">
                                    
                                <div className="flex flex-col gap-4">
                                    <div className="text-2xl flex items-center space-x-3 text-brand">
                                        <FaLocationDot />
                                        <h3 className="font-bold">Office Address</h3>
                                    </div>
                                    
                                    <div className="space-y-2 text-brand">
                                        <p>SNK Market Data Research SB, 11A-2, Jalan USJ1/1A, Regalia Business Center</p>
                                        <p>47620 Subang Jaya, Selangor</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </AnimateOnLoad>

            </div>
        </section>
    )
}
