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
        <section className="w-full bg-brand-element/10 flex flex-col gap-4 md:gap-8 justify-center items-center px-4 py-8 md:px-12 lg:px-24 md:py-16 font-onest text-white snap-start">

            <div className="flex flex-col justify-center items-center text-center gap-4 mx-auto">
                <h1 className="text-brand text-4xl md:text-5xl font-bold">Why Choose SNK?</h1>
                <p className="text-brand md:text-lg md:px-4">We combine decades of expertise with modern technology to deliver the most accurate and reliable vehicle valuations in the industry.</p>
            </div>

            {/* Achievements Grid */}
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {achievements.map((achievement, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-brand-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden border border-brand/20 hover:border-brand hover:bg-brand-white hover:scale-105 transition-all duration-500 ease-in-out shadow-lg h-full flex flex-col group">
                                
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
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 inset-0 bg-gradient-to-t from-brand/30 to-transparent"></div>
                                    
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
        </section>
    )

}