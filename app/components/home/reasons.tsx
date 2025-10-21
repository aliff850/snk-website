import { ReasonCard } from "../ui/reasonCard"
import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import Image from 'next/image';

interface Achievement {
    title: string;
    description: string;
    image: string;
    stat?: string;
    statLabel?: string;
}

export function ReasonSection() {

    const achievements: Achievement[] = [
        {
            title: "25 Years of Excellence",
            description: "Our multi-disciplinary team has strong industry knowledge having been involved in the insurance and claims space for close to two decades.",
            image: "/images/timeline/leader.jpeg",
            stat: "",
            statLabel: ""
        },
        {
            title: "Trusted by Many",
            description: "We have a strong track record in the sector and our platform has all the necessary regulatory approvals from MRC and Bank Negara following industry standards.",
            image: "/images/handshake.jpg",
            stat: "",
            statLabel: ""
        },
        {
            title: "Regional Market Leader",
            description: "We are familiar with the motor claims landscape in Malaysia, Philippines, Thailand and are working towards digitizing your claims processing with greater accuracy, transparency and efficiency",
            image: "/images/sea_2.png",
            stat: "",
            statLabel: ""
        }
    ];

    return(
        <section className="w-full bg-brand-element/10 flex flex-col gap-4 md:gap-8 justify-center items-center px-2 py-4 md:px-12 lg:px-24 md:py-16 font-onest text-white snap-start">

            <div className="flex flex-col justify-center items-center text-center gap-4 max-w-4xl mx-auto">
                <h1 className="text-brand text-4xl md:text-5xl lg:text-6xl font-bold">Why Choose SNK?</h1>
                <p className="text-brand md:text-xl md:px-4">We combine decades of expertise with modern technology to deliver the most accurate and reliable vehicle valuations in the industry.</p>
            </div>

            {/* Achievements Grid */}
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {achievements.map((achievement, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-brand-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-brand/20 hover:border-brand hover:bg-brand-white hover:scale-105 transition-all duration-300 ease-in-out shadow-lg h-full flex flex-col">
                                
                                {/* Image */}
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={achievement.image}
                                        alt={achievement.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand/30 to-transparent"></div>
                                    
                                    {/* Stat Badge */}
                                    {achievement.stat && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-3xl px-4 py-2">
                                            <div className="text-brand text-2xl font-bold">{achievement.stat}</div>
                                            <div className="text-brand text-xs font-medium">{achievement.statLabel}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 md:p-8 flex-1 flex flex-col gap-2 md:gap-4 text-center md:text-left">
                                    <h3 className="text-brand text-2xl font-bold">{achievement.title}</h3>
                                    <p className="text-brand/80 text-base leading-relaxed flex-1">{achievement.description}</p>
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>
            </div>

            {/* <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <ReasonCard
                    title="Proven Industry Expertise"
                    description="With over 35 years of experience in insurance technology and motor vehicle valuation, we have built a reputation for trust, accuracy, and innovation across Malaysia and the region."
                    icon={
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z"/>
                        </svg>
                    }
                />
                <ReasonCard
                    title="Insurtech Solutions"
                    description="From real-time vehicle valuations to AI-powered claims estimation, we continuously pioneer cutting-edge digital platforms that simplify and automate the insurance process."
                    icon={
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
                        </svg>
                    }
                />
                <ReasonCard
                    title="Trusted by Leading Insurers"
                    description="Our solutions are used by top insurance companies such as Allianz, Etiqa, MSIG, Tokio Marine, Great Eastern, Chubb, and more – a testament to our credibility and reliability."
                    icon={
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                        </svg>
                    }
                />
                <ReasonCard
                    title="Seamless End-to-End Service"
                    description="We connect all parties in the insurance ecosystem including customers, insurers, adjusters, and workshops through one integrated platform, delivering faster claims, accurate valuations, and hassle-free support."
                    icon={
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H1V9H3V15H1V17H3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V17H23V15H21V9H23M19 21H5V3H13V9H19V21Z"/>
                        </svg>
                    }
                /> 
                
            </div>*/}

 
        </section>
    )

}