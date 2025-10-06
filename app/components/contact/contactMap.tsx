import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { ContactCard } from '../ui/contactCard';

export function ContactMap() {
    return(
        <section className="w-full bg-brand py-16 px-4 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto">
                
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center mb-12">
                        <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">Visit Our Office</h2>
                        <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                            Located in the heart of Subang Jaya&apos;s business district, our office is easily accessible by public transport and car
                        </p>
                    </div>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        
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
                        <div className="space-y-8">
                        

                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-element rounded-2xl p-3 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-brand text-xl font-bold mb-3">Office Address</h3>
                                        <div className="space-y-2 text-brand">
                                            <p className="font-semibold">SNK Market Data Research Sdn Bhd</p>
                                            <p>SNK Market Data Research SB, 11A-2, Jalan USJ1/1A, Regalia Business Center</p>
                                            <p>47620 Subang Jaya, Selangor</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-element rounded-2xl p-3 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-brand text-xl font-bold mb-3">Office Address</h3>
                                        <div className="space-y-2 text-brand">
                                            <p className="font-semibold">SNK Market Data Research Sdn Bhd</p>
                                            <p>SNK Market Data Research SB, 11A-2, Jalan USJ1/1A, Regalia Business Center</p>
                                            <p>47620 Subang Jaya, Selangor</p>
                                        </div>
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
