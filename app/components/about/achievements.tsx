import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import Image from 'next/image'
import { AchievementCard } from './ui/achievementCard'

interface Achievement {
    title: string;
    description: string;
    image: string;
    stat?: string;
    statLabel?: string;
}

const achievements: Achievement[] = [
    {
        title: "20+ Years of Excellence",
        description: "Over two decades of proven expertise in vehicle insurance, valuations, and insurtech innovation across Malaysia and Southeast Asia.",
        image: "/images/g70.jpg",
        stat: "20+",
        statLabel: "Years Experience"
    },
    {
        title: "Trusted by Leading Insurers",
        description: "Partnered with major insurance companies including Allianz, Etiqa, MSIG, Tokio Marine, Great Eastern, and Chubb for comprehensive claims solutions.",
        image: "/images/handshake.jpg",
        stat: "10+",
        statLabel: "Insurance Partners"
    },
    {
        title: "Regional Market Leader",
        description: "Expanding operations across Thailand, India, and Southeast Asia, establishing SNK as the premier insurtech provider in the region.",
        image: "/images/sea.png",
        stat: "3+",
        statLabel: "Countries Served"
    }
];

export function Achievements() {
    return(
        <section className="w-full min-h-screen justify-center items-center px-4 md:px-12 lg:px-24 py-16 flex flex-col gap-12 font-onest">
            
            {/* Section Header */}
            <AnimateOnLoad animation="fade-in-up">
                <div className="flex flex-col text-center gap-4 max-w-4xl mx-auto">
                    <h1 className="text-brand text-4xl md:text-5xl lg:text-6xl font-bold">Our Achievements</h1>
                    {/* <p className="text-brand text-lg md:text-xl px-4">
                        Milestones that define our journey as a leading insurtech innovator
                    </p> */}
                </div>
            </AnimateOnLoad>

            <AnimateOnLoad animation="fade-in-up">
                <AchievementCard />
            </AnimateOnLoad>

            {/* Achievements Grid */}
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {achievements.map((achievement, index) => (
                        <AnimateOnLoad 
                            key={index}
                            animation="fade-in-up" 
                            delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                        >
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-brand/20 hover:bg-white hover:scale-105 transition-all duration-300 ease-in-out shadow-lg h-full flex flex-col">
                                

                                <div className="relative h-48 w-full">
                                    <Image
                                        src={achievement.image}
                                        alt={achievement.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-brand/30 to-transparent"></div>
                                    

                                    {achievement.stat && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-3xl px-4 py-2">
                                            <div className="text-brand text-2xl font-bold">{achievement.stat}</div>
                                            <div className="text-brand text-xs font-medium">{achievement.statLabel}</div>
                                        </div>
                                    )}
                                </div>


                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-brand text-2xl font-bold mb-4">{achievement.title}</h3>
                                    <p className="text-brand/80 text-base leading-relaxed flex-1">{achievement.description}</p>
                                </div>
                            </div>
                        </AnimateOnLoad>
                    ))}
                </div>
            </div>

            <AnimateOnLoad animation="fade-in-up" delay={400}>
                <div className="w-full max-w-5xl mx-auto">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-brand/20 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-brand text-4xl md:text-5xl font-bold mb-2">80%</div>
                                <div className="text-brand text-lg font-medium">Private Car Coverage</div>
                            </div>
                            <div>
                                <div className="text-brand text-4xl md:text-5xl font-bold mb-2">100%</div>
                                <div className="text-brand text-lg font-medium">Digital Solutions</div>
                            </div>
                            <div>
                                <div className="text-brand text-4xl md:text-5xl font-bold mb-2">24/7</div>
                                <div className="text-brand text-lg font-medium">Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimateOnLoad>

        </section>
    )
}
