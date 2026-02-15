"use client"

import { Car, Truck } from "lucide-react"
import { FaMotorcycle } from "react-icons/fa6"

const navItems = [
    { label: "Car", icon: Car, value: "car" },
    { label: "Motorcycle", icon: FaMotorcycle, value: "motorcycle" },
    { label: "Commercial", icon: Truck, value: "commercial" },
]

interface ValuationBarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function ValuationBar({ activeTab, onTabChange }: ValuationBarProps) {
    return (
        <div className="w-full bg-brand-white rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 font-onest">
            <nav className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-2 md:gap-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.value
                    // const isDisabled = item.value !== "car"

                    return (
                        <button
                            key={item.label}
                            onClick={() => onTabChange(item.value)}
                            //disabled={isDisabled}
                            className={`
                                flex items-center justify-center gap-2 p-2 md:py-2 md:px-4 
                                rounded-full ring transition-all duration-300 font-bold
                                ${isActive
                                    ? "bg-brand text-brand-white ring-brand shadow-md scale-[1.02]"
                                    : "bg-white text-brand ring-foreground/10 hover:ring-brand/50 hover:bg-brand/5"
                                }
                            `}
                        >
                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            {item.label}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}