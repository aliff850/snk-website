"use client"

import Image from "next/image"

const clients = [
    { name: "Allianz", logo: "/clients/allianz.svg" },
    { name: "Etiqa", logo: "/clients/etiqa.svg" },
    { name: "MSIG", logo: "/clients/msig.png" },
    { name: "Tokio Marine", logo: "/clients/tokio.svg" },
    { name: "Great Eastern", logo: "/clients/great-eastern.png" },
    { name: "Chubb", logo: "/clients/chubb.png" },
    { name: "Thai Pai Boon", logo: "/clients/thaipaiboon.svg" },
    // { name: "Lonpac", logo: "/clients/lonpac.png"},
    { name: "Amanah", logo: "/clients/amanah.png" },
    { name: "FPG", logo: "/clients/fpg.png" }
]

// Duplicate clients array for seamless loop
// 4 sets of clients to ensure it covers wide screens and allows smooth infinite scrolling
const duplicatedClients = [...clients, ...clients, ...clients, ...clients]

const ClientCarousel = () => {
    return (
        <section id="clients"
            className="w-full bg-brand/10 px-4 py-8 md:px-12 lg:px-24 md:py-16 font-onest overflow-hidden">

            <div className="flex flex-col justify-center items-center gap-2 md:gap-4 max-w-7xl mx-auto text-center mb-8 md:mb-12">
                <h1 className="text-brand text-4xl md:text-5xl font-bold leading-tight">
                    We Are Trusted by Industry Leaders
                </h1>
                <p className="text-brand/80 md:text-lg leading-relaxed">
                    Join our satisfied clients who rely on our expertise for accurate vehicle valuations and exceptional service.
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Adjust the scrolling speed by decreasing or increasing animationDuration value */}
                {/* This uses CSS animation for the scrolling effect */}
                <div
                    className="flex md:gap-12 gap-8 items-center animate-scroll w-max"
                    style={{ animationDuration: '60s' }}
                >
                    {duplicatedClients.map((client, index) => (
                        <div
                            key={`${client.name}-${index}`}
                            className="flex-shrink-0 group"
                        >
                            <div className="relative w-32 h-32 md:w-40 md:h-48 flex items-center justify-center rounded-2xl p-6 transition-all duration-500 hover:scale-105">
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