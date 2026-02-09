import AnimateOnLoad from '@/components/ui/AnimateOnLoad'
import Image from 'next/image'
import SectionContainer from '@/components/ui/SectionContainer'
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

export function Achievements() {
    return (
        <SectionContainer variant="brand-bg">
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">

                {/* Section Header */}
                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center max-w-4xl mx-auto flex flex-col gap-2 md:gap-4">
                        <h1 className="text-brand text-3xl md:text-4xl font-bold">Our Achievements</h1>
                        <p className="text-brand text-base px-4">
                            Milestones that define our journey as a leading insurtech innovator
                        </p>
                    </div>
                </AnimateOnLoad>

                {/* All governing bodies section */}
                <AnimateOnLoad animation="fade-in-up">
                    <AchievementCard />
                </AnimateOnLoad>

                {/* Achievements Grid */}
                <div className="mt-4 md:mt-0 w-full max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {achievements.map((achievement, index) => (
                            <AnimateOnLoad
                                key={index}
                                animation="fade-in-up"
                                delay={(index * 100 + 200) as 0 | 100 | 200 | 300 | 400}
                            >
                                <div className="bg-brand-white/95 rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-brand/20 hover:ring-brand hover:bg-brand-white hover:scale-105 transition-all duration-500 ease-in-out shadow-lg h-full flex flex-col group">

                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={achievement.image}
                                            alt={achievement.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />

                                        <div className="absolute opacity-0 group-hover:opacity-100 duration-500 inset-0 bg-gradient-to-t from-brand/30 to-transparent"></div>


                                        {achievement.stat && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-3xl px-4 py-2">
                                                <div className="text-brand text-2xl font-bold">{achievement.stat}</div>
                                                <div className="text-brand text-xs font-medium">{achievement.statLabel}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 md:p-6 flex-1 flex flex-col gap-2">
                                        <h3 className="text-brand text-xl md:text-2xl font-bold">{achievement.title}</h3>
                                        <p className="text-brand/80 text-sm md:text-base leading-relaxed flex-1">{achievement.description}</p>
                                    </div>
                                </div>
                            </AnimateOnLoad>
                        ))}
                    </div>
                </div>

                {/* <AnimateOnLoad animation="fade-in-up" delay={400}>
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
            </AnimateOnLoad> */}
            </div>
        </SectionContainer>
    )
}
