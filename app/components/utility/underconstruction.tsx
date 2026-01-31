import { Construction } from "lucide-react"

// Just a component to show a page under construction

export function UnderConstruction() {
    return (
        <div className="h-full flex flex-col justify-center items-center gap-2">

            <Construction className="w-8 h-8 text-brand-white" />
            <p className="text-center text-xl text-brand-white">Under Construction</p>

        </div>
    )
}