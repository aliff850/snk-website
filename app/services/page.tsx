import { ServicesHero } from '@/components/services/hero';
import { SolutionsGrid } from '@/components/services/solutionsGrid';

export const metadata = {
    title: "Services",
};

export default function Services() {
    return (
        <div className="min-h-svh bg-brand-bg">
            <ServicesHero />
            <SolutionsGrid />
        </div>
    )
}