import { ServicesHero } from '@/components/services/hero';
import { SolutionsGrid } from '@/components/services/solutionsGrid';
import { ValuationBanner } from '../components/services/valuationSection';

export default function Services() {
    return(
        <div className="min-h-svh bg-brand-element/30">
            <ServicesHero />
            <ValuationBanner />
            <SolutionsGrid />
        </div>
    )
}