import { AboutHero } from "../components/about/hero"
import { History } from "../components/about/history"
import { Values } from "../components/about/values"
import { Achievements } from "../components/about/achievements"
import { AboutCTA } from "../components/about/cta"

export default function About() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-brand-element/40 via-background to-brand-element/40">
            <AboutHero />
            <History />
            <Values />
            <Achievements />
            <AboutCTA />
        </div>
    )
}