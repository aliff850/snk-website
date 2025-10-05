"use client"

import Image from "next/image"
import { InView, useInView } from "react-intersection-observer"
import { useState, useRef, useEffect } from 'react'

    const clients = [
        { name: "Allianz", logo: "/clients/allianz.svg" },
        { name: "Etiqa", logo: "/clients/etiqa.svg" },
        { name: "MSIG", logo: "/clients/msig.png" },
        { name: "Tokio Marine", logo: "/clients/tokio.svg" },
        { name: "Great Eastern", logo: "/clients/great-eastern.png" },
        { name: "Chubb", logo: "/clients/chubb.png" },
        { name: "Thai Pai Boon", logo: "/clients/thaipaiboon.svg" },
    ]

    // Duplicate clients array for seamless loop
    const duplicatedClients = [...clients, ...clients, ...clients]

    // I did ALL THIS FOR NOTHING!!!!
    const ClientCarousel = () => {
        const [visibleClients, setVisibleClients] = useState(duplicatedClients.slice(0, 12)); // Show initial 12 clients
        const lastClientRef = useRef(null);
        const { ref: lastClientRefInner, inView } = useInView({
            threshold: 0.1, // Trigger when 10% of the last client is visible
            triggerOnce: false, // Allow triggering multiple times as the user scrolls
    });

    useEffect(() => {
        if (inView) {
            setVisibleClients((prevVisibleClients) => {
                const nextVisibleClients = prevVisibleClients.slice(-12).concat(duplicatedClients.slice(prevVisibleClients.length, prevVisibleClients.length + 12));
                return nextVisibleClients;
            });
        }
    }, [inView]);

    return(
        <section 
            className="w-full bg-gradient-to-br from-brand-element/20 via-background to-brand-element/20 px-4 py-8 md:px-12 lg:px-24 md:py-16 font-onest overflow-hidden">
            
            <div className="flex flex-col justify-center items-center gap-4 mb-4 max-w-7xl mx-auto text-center">
                <h1 className="text-brand text-4xl md:text-6xl font-bold leading-tight">
                    Trusted by Industry Leaders
                </h1>
                <p className="text-brand/80 text-lg md:text-xl max-w-2xl leading-relaxed">
                    Join our satisfied clients who rely on our expertise for accurate vehicle valuations and exceptional service.
                </p>
            </div>

            <div className="relative">                
                <div 
                    className="flex gap-12 items-center animate-scroll"
                >
                    {visibleClients.map((client, index) => (
                    <div
                        key={`${client.name}-${index}`}
                        className="flex-shrink-0 group"
                        ref={index === visibleClients.length - 1 ? lastClientRefInner : null}
                    >
                            <div className="relative w-40 h-48 flex items-center justify-center rounded-2xl p-6 transition-all duration-500 hover:scale-105">
                                <Image
                                    src={client.logo || "/placeholder.svg"}
                                    alt={`${client.name} logo`}
                                    width={180}
                                    height={100}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default ClientCarousel;