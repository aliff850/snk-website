import Link from "next/link"
import { ArrowUpRight, CircleDollarSign, HandCoins } from "lucide-react"
import { FaCar } from "react-icons/fa"

export const metadata = {
    title: "Real-Time Online Inquiry Platform",
};

const choices = [
    {
        href: "/valuation/insurable",
        title: "Insurable Value",
        caption: "Insurable value for cars, motorcycles and commercial vehicles, based on SNK's master database.",
        icon: HandCoins,
    },
    {
        href: "/valuation/market",
        title: "Current Market Valuation",
        caption: "Current market value based on vehicles listed for sale right now.",
        icon: CircleDollarSign,
    },
]

// Entry point for the "Get Value" / "Get Valuation" buttons: pick which valuation to run.
export default function VehicleValuation() {
    return (
        <section className="w-full min-h-screen bg-fixed bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full min-h-screen bg-black/50 px-4 md:px-12 lg:px-24 pb-8 md:pb-16 pt-24">
                <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-10">
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <FaCar className="w-10 h-10 text-brand-element" />
                        <h1 className="text-xl text-center md:text-3xl font-bold text-brand-element">SNK Real-Time Online Inquiry Platform</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {choices.map(({ href, title, caption, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group rounded-2xl md:rounded-3xl border border-foreground/40 bg-brand-white p-6 md:p-8 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="p-3 rounded-xl bg-purple-100 w-fit">
                                    <Icon className="w-7 h-7 text-purple-900" />
                                </div>
                                <h2 className="text-2xl font-bold text-brand">{title}</h2>
                                <p className="text-foreground/80 flex-1">{caption}</p>
                                <span className="inline-flex items-center gap-2 font-semibold text-brand group-hover:gap-3 transition-all">
                                    Start <ArrowUpRight className="w-5 h-5" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
