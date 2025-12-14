"use client"

import { Car, Truck } from "lucide-react"
import { FaMotorcycle } from "react-icons/fa6"

const navItems = [
    { label: "Car", icon: Car, value: "car" },
    { label: "Motorcycle", icon: FaMotorcycle, value: "motorcycle" },
    { label: "Lorries", icon: Truck, value: "lorries" },
]

interface ValuationBarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function ValuationBar({ activeTab, onTabChange }: ValuationBarProps) {
    return (
        <div className="w-full bg-brand-white rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-2 md:p-4 font-onest">
            <nav className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.value
                    const isDisabled = item.value === "lorries"
                    
                    return (
                        <button
                            key={item.label}
                            onClick={() => !isDisabled && onTabChange(item.value)}
                            disabled={isDisabled}
                            className={`
                                flex items-center justify-center gap-2 flex-1 p-2 md:px-4 md:py-2 
                                rounded-xl md:rounded-2xl font-semibold text-sm md:text-base lg:text-lg 
                                transition-all duration-300 ease-in-out
                                ${isActive 
                                    ? "text-brand-white bg-brand" 
                                    : isDisabled
                                    ? "text-foreground/30 cursor-not-allowed"
                                    : "hover:text-brand-white hover:bg-brand"
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