interface ContactCardProps {
    title: string,
    line1: string,
    line2: string,
    line3: string,
    icon: React.ReactNode,
}

export function ContactCard({
    title,
    line1,
    line2,
    line3,
    icon
}:ContactCardProps) {

    return(
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg">
            <div className="flex items-start gap-4">
                <div className="bg-brand-element rounded-2xl p-3 flex-shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="text-brand text-xl font-bold mb-3">{title}</h3>
                    <div className="space-y-2 text-brand">
                        <p className="font-semibold">{line1}</p>
                        <p>{line2}</p>
                        <p>{line3}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}