import { AboutHero } from "../components/about/hero"
import { History } from "../components/about/history"
import { Values } from "../components/about/values"
import { Achievements } from "../components/about/achievements"
import { AboutCTA } from "../components/about/cta"

export const metadata = {
    title: "About Us",
};

export default function About() {
    return (
        <div className="min-h-svh bg-brand-bg">
            <AboutHero />
            <History />
            <Values />
            <Achievements />
            <AboutCTA />
        </div>
    );
}