"use client"

import { LucideIcon } from "lucide-react"

interface SelectionItem {
    id: string
    label: string
    icon: LucideIcon
}

interface SelectionButtonGroupProps {
    items: SelectionItem[]
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    className?: string
}

export function SelectionButtonGroup({
    items,
    value,
    onChange,
    disabled = false,
    className = ""
}: SelectionButtonGroupProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-${items.length} gap-2 md:gap-4 ${className}`}>
            {items.map((item) => {
                const Icon = item.icon
                const isActive = value === item.id
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => !disabled && onChange(item.id)}
                        disabled={disabled}
                        className={`
                            flex items-center justify-center gap-2 p-2 md:py-2 md:px-4 
                            rounded-full ring transition-all duration-300 font-bold
                            ${isActive
                                ? "bg-brand text-brand-white ring-brand shadow-md scale-[1.02]"
                                : "bg-white text-brand ring-foreground/10 hover:ring-brand/50 hover:bg-brand/5"
                            }
                            ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}
                        `}
                    >
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? "text-brand-white" : "text-brand"}`} />
                        <span className="text-sm md:text-base">{item.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
