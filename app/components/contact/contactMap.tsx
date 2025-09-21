import AnimateOnLoad from '@/components/ui/AnimateOnLoad';

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
                            
                            {/* Address Card */}
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

                            {/* Transportation */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
                                <h3 className="text-brand text-xl font-bold mb-6">How to Get Here</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-brand-element rounded-lg p-2 flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-brand font-semibold mb-1">By Train</h4>
                                            <p className="text-brand text-sm">KL Sentral Station - Direct access via KTM, LRT, MRT, and KLIA Express</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="bg-brand-element rounded-lg p-2 flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 7H22V9H19V12H17V9H14V7H17V4H19V7Z"/>
                                            </svg>
                                            
                                        </div>
                                        <div>
                                            <h4 className="text-brand font-semibold mb-1">By Car</h4>
                                            <p className="text-brand text-sm">Paid parking available in KL Sentral complex</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="bg-brand-element rounded-lg p-2 flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23M19 21H5V3H13V9H19V21Z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-brand font-semibold mb-1">By Bus</h4>
                                            <p className="text-brand text-sm">Multiple bus routes connect to KL Sentral from all parts of the city</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nearby Landmarks */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
                                <h3 className="text-brand text-xl font-bold mb-6">Nearby Landmarks</h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="bg-brand-element/10 rounded-lg p-3 mb-2">
                                            <svg className="w-6 h-6 text-brand-element mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                                            </svg>
                                        </div>
                                        <h4 className="text-brand font-semibold text-sm">KL Sentral</h4>
                                        <p className="text-brand/70 text-xs">2 minutes walk</p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="bg-brand-element/10 rounded-lg p-3 mb-2">
                                            <svg className="w-6 h-6 text-brand-element mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 7H22V9H19V12H17V9H14V7H17V4H19V7Z"/>
                                            </svg>
                                        </div>
                                        <h4 className="text-brand font-semibold text-sm">Nu Sentral Mall</h4>
                                        <p className="text-brand/70 text-xs">3 minutes walk</p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="bg-brand-element/10 rounded-lg p-3 mb-2">
                                            <svg className="w-6 h-6 text-brand-element mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23M19 21H5V3H13V9H19V21Z"/>
                                            </svg>
                                        </div>
                                        <h4 className="text-brand font-semibold text-sm">KL City Air Terminal</h4>
                                        <p className="text-brand/70 text-xs">5 minutes walk</p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="bg-brand-element/10 rounded-lg p-3 mb-2">
                                            <svg className="w-6 h-6 text-brand-element mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
                                            </svg>
                                        </div>
                                        <h4 className="text-brand font-semibold text-sm">KL Tower</h4>
                                        <p className="text-brand/70 text-xs">15 minutes drive</p>
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
