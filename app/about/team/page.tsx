import { TeamHero } from "@/app/components/about/team/hero"
import { TeamChart } from "@/app/components/about/team/team"

export default function OurTeam() {
    
    return(

        <div className="min-h-svh bg-brand-element/10">

            <TeamHero />
            <TeamChart />

        </div>

    )
}