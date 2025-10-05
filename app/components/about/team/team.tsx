import Image from "next/image";
import AnimateOnLoad from "../../ui/AnimateOnLoad";

type TeamMember = {
    name: string;
    role: string;
    image: string;
    bio: string;
};

const teamTopLevel: TeamMember[] = [
    {
        name: "Mr. Krishnan",
        role: "Managing Director",
        image: "/images/employee.png",
        bio: "Visionary leader with over xx years in insurtech transformation and operational excellence.",
    },
];

const teamSecondary: TeamMember[] = [
    {
        name: "Nicholas Raj",
        role: "Technical Manager",
        image: "/images/employee.png",
        bio: "Drives delivery quality, engineering process, and cross-team collaboration.",
    },
    {
        name: "Nicholas Raj",
        role: "CTO",
        image: "/images/employee.png",
        bio: "Architects scalable platforms with a focus on reliability, security, and speed.",
    },
    {
        name: "Nicholas Raj",
        role: "Data Research Manager",
        image: "/images/employee.png",
        bio: "Leads data science initiatives turning research into practical decision support.",
    },
    {
        name: "Nicholas Raj",
        role: "Head of Teams",
        image: "/images/employee.png",
        bio: "Builds high-trust, high-performing teams with a human-centered approach.",
    },
];

function TeamCard({ member }: { member: TeamMember }) {
    return (
        <div className="w-full sm:max-w-md lg:max-w-lg mx-auto group relative overflow-hidden rounded-3xl bg-background/60 hover:ring-brand/60 transition-colors duration-300 shadow-xl">
            <div className="relative h-80 sm:h-96">
                <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
                    priority={false}
                />
                {/* WOOOO AI */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm text-white">{member.role}</p>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                </div>
            </div>

            {/* overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-end bg-brand/0 group-hover:bg-brand/20 transition-colors duration-300">
                <div className="w-full translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out p-5">
                    <div className="rounded-xl bg-brand/90 text-brand-white p-4 backdrop-blur">
                        <p className="leading-relaxed">{member.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TeamChart() {

    return(

        <section className="w-full min-h-screen justify-center items-center px-4 md:px-12 lg:px-24 py-16 flex flex-col gap-12 font-onest">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">
                <AnimateOnLoad animation="fade-in-up">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand text-center">Leadership</h2>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-up" delay={100}>
                    <div className="w-full mx-auto flex justify-center">
                        {teamTopLevel.map((m) => (
                            <TeamCard key={m.role} member={m} />
                        ))}
                    </div>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamSecondary.map((m) => (
                            <TeamCard key={m.role} member={m} />
                        ))}
                    </div>
                </AnimateOnLoad>
            </div>
        </section>

    )

}