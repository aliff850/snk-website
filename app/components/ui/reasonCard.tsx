interface ReasonCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export function ReasonCard({
    title,
    description,
    icon
}: ReasonCardProps) {
    
    return(
        <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-brand-bg/20 to-brand-bg/40 border border-brand-element/30 flex flex-col items-start justify-start hover:scale-105 hover:bg-gradient-to-br hover:from-brand-bg/30 hover:to-brand-bg/50 hover:shadow-2xl hover:shadow-brand/20 transition-all duration-500 ease-out h-full">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 via-transparent to-brand-element/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            <div className="relative z-10 mb-6 p-4 rounded-xl bg-gradient-to-br from-brand to-brand-element text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            
            <div className="relative z-10 space-y-4 flex flex-col h-full">
                <h2 className="text-xl font-bold text-brand leading-tight group-hover:text-brand-element transition-colors duration-300 min-h-[3rem] flex items-center">
                    {title}
                </h2>
                <p className="text-brand text-base leading-relaxed group-hover:text-brand-hover transition-colors duration-300 flex-1">
                    {description}
                </p>
            </div>

            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-element opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
    )
}