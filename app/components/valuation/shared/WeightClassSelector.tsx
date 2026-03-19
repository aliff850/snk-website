"use client"

import { FaTruckMoving } from "react-icons/fa6"
import { BiSolidTruck } from "react-icons/bi"

interface WeightClass {
    id: string
    label: string
    sublabel: string
    description: string
}

const WEIGHT_CLASSES: WeightClass[] = [
    {
        id: "below10ton",
        label: "Below 10 Ton",
        sublabel: "Light Commercial",
        description:
            "Vehicles with a Gross Vehicle Mass (GVM) under 10,000 kg including lorries, vans, mini-trucks, and pick-ups commonly used for light delivery.",
    },
    {
        id: "above10ton",
        label: "Above 10 Ton",
        sublabel: "Heavy Commercial",
        description:
            "Vehicles with a GVM of 10,000 kg and above including heavy lorries, prime movers, trailers, and large cargo trucks used for bulk transport.",
    },
]

interface WeightClassSelectorProps {
    value: string
    onChange: (id: string) => void
}

export function WeightClassSelector({ value, onChange }: WeightClassSelectorProps) {
    return (
        <div className="flex flex-col items-center gap-6 py-4 w-full">
            {/* Heading */}
            <div className="text-center space-y-1">
                <h1 className="text-xl md:text-2xl font-bold text-brand">
                    Select Vehicle Weight Class
                </h1>
                <p className="text-sm text-brand-black">
                    Choose the weight category that applies to your commercial vehicle
                </p>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {WEIGHT_CLASSES.map((wc) => {
                    const isActive = value === wc.id
                    const isBelow = wc.id === "below10ton"

                    return (
                        <button
                            key={wc.id}
                            type="button"
                            onClick={() => onChange(wc.id)}
                            aria-pressed={isActive}
                            className={[
                                // Layout
                                "group relative flex flex-col items-center justify-between",
                                "min-h-[200px] p-6 rounded-2xl overflow-hidden",
                                // Border / ring
                                "border-2 transition-all duration-300 ease-out",
                                // Focus
                                "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/40",
                                // Active vs idle
                                isActive
                                    ? "border-brand bg-brand text-brand-white shadow-xl scale-[1.02]"
                                    : "border-brand/20 bg-white text-brand hover:border-brand/60 hover:shadow-lg hover:scale-[1.01]",
                            ].join(" ")}
                        >
                            {/* Subtle background gradient blob */}
                            <span
                                aria-hidden="true"
                                className={[
                                    "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                                    "bg-gradient-to-br",
                                    isActive
                                        ? "from-white/10 to-transparent opacity-100"
                                        : "from-brand/5 to-transparent opacity-0 group-hover:opacity-100",
                                ].join(" ")}
                            />

                            {/* Top: label area */}
                            <div className="relative flex flex-col items-center gap-1 z-10">
                                <span
                                    className={[
                                        "text-xs font-semibold uppercase tracking-widest px-3 py-0.5 rounded-full",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-brand/10 text-brand",
                                    ].join(" ")}
                                >
                                    {wc.sublabel}
                                </span>
                                <span className="text-lg md:text-xl font-extrabold tracking-tight">
                                    {wc.label}
                                </span>
                            </div>

                            {/* Middle: truck icon */}
                            <div className="relative z-10 flex items-center justify-center w-full py-2">
                                {isBelow ? (
                                    <BiSolidTruck
                                        className={[
                                            "w-24 h-auto transition-transform duration-500",
                                            "group-hover:scale-105 ease-in-out",
                                            isActive ? "text-white drop-shadow-md" : "text-brand",
                                        ].join(" ")}
                                    />
                                ) : (
                                    <FaTruckMoving
                                        className={[
                                            "w-24 h-auto transition-transform duration-500",
                                            "group-hover:scale-105 ease-in-out",
                                            isActive ? "text-white drop-shadow-md" : "text-brand",
                                        ].join(" ")}
                                    />
                                )}
                            </div>

                            {/* Bottom: description fades in on hover / always visible when active */}
                            <div
                                className={[
                                    "relative z-10 text-center transition-all duration-500 overflow-hidden ease-in-out",
                                    isActive
                                        ? "max-h-24 opacity-100"
                                        : "max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100",
                                ].join(" ")}
                            >
                                <p
                                    className={[
                                        "text-xs leading-relaxed pt-2",
                                        isActive ? "text-white/85" : "text-brand-black",
                                    ].join(" ")}
                                >
                                    {wc.description}
                                </p>
                            </div>

                            {/* Active check badge */}
                            {isActive && (
                                <span
                                    aria-hidden="true"
                                    className="absolute top-3 right-3 w-6 h-6 bg-white/25 rounded-full flex items-center justify-center"
                                >
                                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                        <path
                                            d="M3 8l3.5 3.5L13 4.5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
