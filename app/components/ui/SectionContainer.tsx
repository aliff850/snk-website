export default function SectionContainer({
    children,
    variant = 'brand'
}: {
    children: React.ReactNode;
    variant?: 'brand' | 'brand-bg'
}) {
    const variants = {
        'brand': 'bg-brand text-white',
        'brand-bg': 'bg-brand-bg text-brand'
    };

    const variantClasses = variants[variant];

    return (
        <section
            className={`w-full ${variantClasses} flex flex-col justify-center items-center px-4 py-8 md:px-12 lg:px-24 md:py-12 font-onest snap-start`}
        >
            {children}
        </section>
    );
}