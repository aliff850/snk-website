import { TeamHero } from "@/app/components/about/team/hero"
import { TeamChart } from "@/app/components/about/team/team"

export default function OurTeam() {
    
    return(

        <div className="min-h-svh bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40">

            <TeamHero />
            <TeamChart />

        </div>

    )
}