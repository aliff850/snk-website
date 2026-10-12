"use client"

import { useState } from "react"
import { Truck } from "lucide-react"
import { ValuationBar } from "@/components/ui/ValuationBar"
import { ValuationPageShell } from "../shared/ValuationPageShell"
import { CarMarket } from "./CarMarket"
import { MotorcycleMarket } from "./MotorcycleMarket"

// Current Market Valuation page: Car / Motorcycle / Commercial tabs
export function MarketValuation() {
    const [tab, setTab] = useState("car")

    return (
        <ValuationPageShell title="Current Market Valuation">
            <ValuationBar activeTab={tab} onTabChange={setTab} />

            {tab === 'car' && <CarMarket />}

            {tab === 'motorcycle' && <MotorcycleMarket />}

            {tab === 'commercial' && (
                <div className="rounded-2xl md:rounded-3xl border border-dashed border-foreground/40 p-8 md:p-12 bg-brand-white flex flex-col items-center gap-3 text-center">
                    <Truck className="w-14 h-14 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-700">Commercial market valuation is coming soon</h3>
                    <p className="text-gray-500 max-w-md">In the meantime, the insurable value for commercial vehicles is available on the Insurable Value page.</p>
                </div>
            )}
        </ValuationPageShell>
    )
}
