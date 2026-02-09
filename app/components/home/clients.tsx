import Image from "next/image"

export function ClientSection() {

    const clients = [
        { name: "Allianz", logo: "/clients/allianz.svg" },
        { name: "Etiqa", logo: "/clients/etiqa.svg" },
        { name: "MSIG", logo: "/clients/msig.png" },
        { name: "Tokio Marine", logo: "/clients/tokio.svg" },
        { name: "Great Eastern", logo: "/clients/great-eastern.png" },
        { name: "Chubb", logo: "/clients/chubb.png" },
        { name: "Thai Pai Boon", logo: "/clients/thaipaiboon.svg" },
    ]

    return (

        <section className="w-full bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40 min-h-svh justify-center items-center px-24 py-16 grid grid-cols-2 gap-8 font-onest text-white">

            <div className="flex flex-col justify-center items-center gap-4">
                <h1 className="text-brand text-6xl font-bold">Trusted by Industry Leaders</h1>
                <p className="text-brand text-xl">Join thousands of satisfied clients who rely on our expertise for accurate vehicle valuations and exceptional service.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full h-full">

                {clients.map((client, index) => (
                    <div
                        key={index}
                        className="hover:scale-105 transition-all duration-300 opacity-60 hover:opacity-100 shadow-lg hover:shadow-2xl rounded-xl p-4 bg-background flex flex-col items-center"
                    >
                        <Image
                            src={client.logo || "/placeholder.svg"}
                            alt={`${client.name} logo`}
                            width={120}
                            height={120}
                            className="object-center w-full"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}