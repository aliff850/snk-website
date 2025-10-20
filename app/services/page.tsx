import { ServicesHero } from '@/components/services/hero';
import { SolutionsGrid } from '@/components/services/solutionsGrid';

export default function Services() {
    return(
        <div className="min-h-svh bg-brand-element/10">
            <ServicesHero />
            <SolutionsGrid />
        </div>
    )
}