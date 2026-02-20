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

/* ─── Small truck SVG (below 10 ton) ─────────────────────────────────── */
function SmallTruckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 80 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Cab */}
            <rect x="42" y="10" width="30" height="24" rx="3" fill="currentColor" opacity="0.9" />
            {/* Windshield */}
            <rect x="55" y="14" width="14" height="12" rx="2" fill="white" opacity="0.3" />
            {/* Body */}
            <rect x="8" y="14" width="36" height="20" rx="2" fill="currentColor" />
            {/* Chassis */}
            <rect x="6" y="34" width="66" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
            {/* Front wheel */}
            <circle cx="60" cy="40" r="7" fill="currentColor" />
            <circle cx="60" cy="40" r="3.5" fill="white" opacity="0.3" />
            {/* Rear wheel */}
            <circle cx="22" cy="40" r="7" fill="currentColor" />
            <circle cx="22" cy="40" r="3.5" fill="white" opacity="0.3" />
            {/* Exhaust */}
            <rect x="70" y="6" width="3" height="10" rx="1.5" fill="currentColor" opacity="0.5" />
        </svg>
    )
}

/* ─── Heavy truck SVG (above 10 ton) ─────────────────────────────────── */
function HeavyTruckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 96 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Trailer body */}
            <rect x="2" y="8" width="52" height="28" rx="2" fill="currentColor" />
            {/* Trailer ribs */}
            {[14, 26, 38].map((x) => (
                <rect key={x} x={x} y="8" width="2" height="28" fill="white" opacity="0.12" />
            ))}
            {/* Connector */}
            <rect x="52" y="18" width="6" height="8" rx="1" fill="currentColor" opacity="0.7" />
            {/* Cab body */}
            <rect x="56" y="10" width="34" height="26" rx="3" fill="currentColor" opacity="0.95" />
            {/* Windshield */}
            <rect x="72" y="13" width="14" height="14" rx="2" fill="white" opacity="0.3" />
            {/* Chassis */}
            <rect x="2" y="36" width="88" height="5" rx="1.5" fill="currentColor" opacity="0.6" />
            {/* Exhaust stack */}
            <rect x="86" y="2" width="4" height="14" rx="2" fill="currentColor" opacity="0.5" />
            {/* Front wheel */}
            <circle cx="76" cy="42" r="7" fill="currentColor" />
            <circle cx="76" cy="42" r="3.5" fill="white" opacity="0.3" />
            {/* Rear drive axle (dual wheels) */}
            <circle cx="26" cy="42" r="7" fill="currentColor" />
            <circle cx="26" cy="42" r="3.5" fill="white" opacity="0.3" />
            <circle cx="40" cy="42" r="7" fill="currentColor" />
            <circle cx="40" cy="42" r="3.5" fill="white" opacity="0.3" />
        </svg>
    )
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
