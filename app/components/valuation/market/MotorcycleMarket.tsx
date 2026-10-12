"use client"

import { useEffect, useState } from "react"
import { ArrowDown, RotateCcw } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import SearchableSelect from "@/components/ui/SearchableSelect"
import { Button } from "@/components/ui/ButtonComponent"
import { scrollToElement } from "@/app/components/ui/SmoothScroll"
import { FormSelect } from "../shared/FormSelect"
import UnifiedListingsDisplay from "../listings/MainValuationContainer"
import { CheckOtherPrompt } from "../shared/CheckOtherPrompt"
import { saveResult } from "../shared/compareStore"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') : ''
const label = (slug: string) => slug.replace(/-/g, ' ').toUpperCase()
const YEARS = Array.from({ length: new Date().getFullYear() - 1979 }, (_, i) => String(new Date().getFullYear() - i))

// Motorcycle tab of the Current Market Valuation page (make, model and year, like the old motorcycle form)
export function MotorcycleMarket() {
    const { refreshTokens, getAccessToken } = useAuth()

    const [makes, setMakes] = useState<string[]>([])
    const [models, setModels] = useState<string[]>([])
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [year, setYear] = useState("")

    const [searching, setSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<{ listings: any[]; userInputs: any } | null>(null)

    useEffect(() => {
        fetch(`${API_BASE}/api/market/makes?type=motorcycle`).then(r => r.ok ? r.json() : null).then(d => setMakes(d?.makes || []))
    }, [])

    useEffect(() => {
        setModels([]); setModel("")
        if (make) fetch(`${API_BASE}/api/market/models?type=motorcycle&make=${encodeURIComponent(make)}`).then(r => r.ok ? r.json() : null).then(d => setModels(d?.models || []))
    }, [make])

    const resetAll = () => { setMake(""); setYear(""); setResults(null); setError(null) }

    const handleSubmit = async () => {
        if (!make || !model) { setError("Please select the make and model."); return }
        setSearching(true); setError(null); setResults(null)
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) { setError("Please log in again."); return }
            const res = await fetch(`${API_BASE}/api/valuation/get_marketdata`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ vehicle_type: 'motorcycle', vehicle: { make, model, year: year || null } }),
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) { setError(data?.detail || "Something went wrong. Please try again."); return }
            await refreshTokens()

            const listings: any[] = Array.isArray(data.results?.listings) ? data.results.listings : []
            const userInputs = { make: label(make), model: label(model), year }
            setResults({ listings, userInputs })

            const prices = listings.map(l => Number(l.price)).filter(p => p > 0)
            if (prices.length > 0) {
                const lowest = Math.min(...prices), highest = Math.max(...prices)
                saveResult({
                    kind: 'market',
                    selections: [
                        { label: 'Type', value: 'Motorcycle' }, { label: 'Make', value: userInputs.make },
                        { label: 'Model', value: userInputs.model }, { label: 'Year', value: year },
                    ],
                    lowest, highest, average: Math.round((lowest + highest) / 2),
                    date: new Date().toISOString(),
                    listingCount: prices.length,
                })
            }
            setTimeout(() => scrollToElement("results"), 100)
        } catch (e: any) {
            setError(e?.message || "Something went wrong. Please try again.")
        } finally {
            setSearching(false)
        }
    }

    return (
        <>
            <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                        <h3 className="text-lg font-bold text-brand">Motorcycle Details</h3>
                        <p className="text-xs">Market value is based on motorcycles currently listed for sale.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">*Make</label>
                            <SearchableSelect value={make} onChange={setMake} options={makes.map(m => ({ value: m, label: label(m) }))} placeholder="Select a make..." isLoading={makes.length === 0} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">*Model</label>
                            <SearchableSelect value={model} onChange={setModel} options={models.map(m => ({ value: m, label: label(m) }))} placeholder="Select a model..." disabled={!make} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <FormSelect value={year} onChange={(e) => setYear(e.target.value)} disabled={!model} options={YEARS} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Button type="button" onClick={handleSubmit} disabled={searching} variant="secondary" size="sm" className="w-full text-lg md:text-xl flex justify-center gap-2">
                            {searching ? "Searching..." : "Get Market Value"} <ArrowDown className="h-5 w-5" />
                        </Button>
                        <Button type="button" onClick={resetAll} variant="secondary" size="sm" className="w-full text-lg md:text-xl flex justify-center items-center gap-2">
                            Reset <RotateCcw className="h-5 w-5" />
                        </Button>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                </form>
            </div>

            <div id="results">
                {results && (
                    <div className="rounded-2xl md:rounded-3xl border border-foreground/40 p-4 md:p-6 bg-brand-white flex flex-col gap-4">
                        <UnifiedListingsDisplay listings={results.listings} userInputs={results.userInputs} vehicleType="motorcycle" showInsurable={false} />
                        <CheckOtherPrompt target="insurable" />
                    </div>
                )}
            </div>
        </>
    )
}
