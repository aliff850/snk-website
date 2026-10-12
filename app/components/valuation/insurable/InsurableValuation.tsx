"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDown, HandCoins, RotateCcw } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import SearchableSelect from "@/components/ui/SearchableSelect"
import { Button } from "@/components/ui/ButtonComponent"
import { scrollToElement } from "@/app/components/ui/SmoothScroll"
import { FormSelect } from "../shared/FormSelect"
import { PriceContainer } from "../listings/MainValuationContainer"
import { ValuationPageShell } from "../shared/ValuationPageShell"
import { CheckOtherPrompt } from "../shared/CheckOtherPrompt"
import { saveResult } from "../shared/compareStore"
import { ValuationBar } from "@/components/ui/ValuationBar"

const TAB_LABELS: Record<string, string> = { car: "Car", motorcycle: "Motorcycle", light: "Light Commercial", heavy: "Heavy Commercial" }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') : ''

async function getJson(path: string) {
    const res = await fetch(`${API_BASE}${path}`)
    return res.ok ? res.json() : null
}

interface InsurableResult {
    lowest?: number
    average?: number
    highest?: number
}

// Insurable Value page: every option comes from our own database.
export function InsurableValuation() {
    const { refreshTokens, getAccessToken } = useAuth()

    // Vehicle type tab; commercial vehicles are split into light and heavy in our database, so the user picks one
    const [tab, setTab] = useState("car")
    const [weight, setWeight] = useState("")
    const category = tab === "commercial" ? weight : tab
    const [makes, setMakes] = useState<string[]>([])
    const [models, setModels] = useState<string[]>([])
    const [variants, setVariants] = useState<string[]>([])
    const [styles, setStyles] = useState<string[]>([])
    const [years, setYears] = useState<string[]>([])
    const [specs, setSpecs] = useState<{ import_statuses: string[]; transmissions: string[]; engine_ccs: string[] }>({ import_statuses: [], transmissions: [], engine_ccs: [] })

    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [variant, setVariant] = useState("")
    const [style, setStyle] = useState("")
    const [year, setYear] = useState("")
    const [importStatus, setImportStatus] = useState("")
    const [transmission, setTransmission] = useState("")
    const [cc, setCc] = useState("")

    const [loadingOptions, setLoadingOptions] = useState(false)
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<InsurableResult | null>(null)

    const q = (params: Record<string, string>) => new URLSearchParams({ ...params, category }).toString()

    useEffect(() => {
        setMakes([]); setMake(""); setResult(null); setError(null)
        if (!category) return
        getJson(`/api/valuation/options/makes?${q({})}`).then(d => setMakes(d?.makes || []))
    }, [category])

    // Each choice loads the options for the next one and clears everything after it
    useEffect(() => {
        setModels([]); setModel("")
        if (make) getJson(`/api/valuation/options/models?${q({ make })}`).then(d => setModels(d?.models || []))
    }, [make, category])

    useEffect(() => {
        setVariants([]); setVariant("")
        if (!model) return
        setLoadingOptions(true)
        getJson(`/api/valuation/options/variants?${q({ make, model })}`)
            .then(d => { const v = d?.variants || []; setVariants(v); if (v.length === 1) setVariant(v[0]) })
            .finally(() => setLoadingOptions(false))
    }, [make, model, category])

    useEffect(() => {
        setStyles([]); setStyle("")
        if (!variant) return
        getJson(`/api/valuation/options/body-types?${q({ make, model, variant })}`)
            .then(d => { const s = d?.body_types || []; setStyles(s); if (s.length === 1) setStyle(s[0]) })
    }, [make, model, variant, category])

    useEffect(() => {
        setYears([]); setYear("")
        if (!style) return
        getJson(`/api/valuation/options/years?${q({ make, model, variant, style })}`)
            .then(d => { const y = (d?.years || []).map(String); setYears(y); if (y.length === 1) setYear(y[0]) })
    }, [make, model, variant, style, category])

    useEffect(() => {
        setSpecs({ import_statuses: [], transmissions: [], engine_ccs: [] }); setImportStatus(""); setTransmission(""); setCc("")
        if (!year) return
        getJson(`/api/valuation/options/variant-specs?${q({ make, model, variant, style, year })}`).then(d => {
            if (!d) return
            setSpecs({ import_statuses: d.import_statuses || [], transmissions: d.transmissions || [], engine_ccs: d.engine_ccs || [] })
            if (d.import_statuses?.length === 1) setImportStatus(d.import_statuses[0])
            if (d.transmissions?.length === 1) setTransmission(d.transmissions[0])
            if (d.engine_ccs?.length === 1) setCc(d.engine_ccs[0])
        })
    }, [make, model, variant, style, year, category])

    const canSubmit = useMemo(() => Boolean(make && model && year && (variant || variants.length === 0)), [make, model, year, variant, variants])

    const resetAll = () => { setMake(""); setResult(null); setError(null) }

    const handleSubmit = async () => {
        if (!canSubmit) { setError("Please select the make, model, variant and year."); return }
        setSearching(true); setError(null); setResult(null)
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) { setError("Please log in again."); return }
            const res = await fetch(`${API_BASE}/api/valuation/insurable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ category, make, model, year, variant: variant || null, style: style || null, transmission: transmission || null, cc: cc || null, import_status: importStatus || null }),
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) { setError(data?.detail || "Something went wrong. Please try again."); return }
            await refreshTokens()

            const insurable: InsurableResult = data.insurable || {}
            setResult(insurable)
            if (insurable.lowest) {
                saveResult({
                    kind: 'insurable',
                    selections: [
                        { label: 'Type', value: TAB_LABELS[category] }, { label: 'Make', value: make }, { label: 'Model', value: model }, { label: 'Variant', value: variant },
                        { label: 'Body Type', value: style }, { label: 'Year', value: year },
                        { label: 'Import Status', value: importStatus },
                        { label: 'Engine Capacity', value: cc ? `${cc} cc` : '' },
                    ],
                    lowest: insurable.lowest || 0, average: insurable.average || 0, highest: insurable.highest || 0,
                    date: new Date().toISOString(),
                })
            }
            setTimeout(() => scrollToElement("results"), 100)
        } catch (e: any) {
            setError(e?.message || "Something went wrong. Please try again.")
        } finally {
            setSearching(false)
        }
    }

    const formatPrice = (price?: number) => price ? `RM ${price.toLocaleString()}` : "No Data"
    const field = (label: string, loading?: boolean) => (
        <label className="block text-sm font-medium mb-1">{label} {loading && <span className="text-xs text-foreground/50">Loading...</span>}</label>
    )

    return (
        <ValuationPageShell title="Insurable Value">
            <ValuationBar activeTab={tab} onTabChange={(t) => { setTab(t); setWeight("") }} />

            {tab === "commercial" && (
                <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 bg-brand-white flex flex-col gap-3">
                    <p className="text-center font-medium text-brand">Select the commercial vehicle class</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {["light", "heavy"].map(w => (
                            <button
                                key={w}
                                type="button"
                                onClick={() => setWeight(w)}
                                className={`rounded-full py-2 font-semibold transition-colors ${weight === w ? "bg-brand text-brand-white" : "border border-brand/40 text-brand hover:bg-brand/10"}`}
                            >
                                {TAB_LABELS[w]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {category && (<>
            <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                        <h3 className="text-lg font-bold text-brand">Vehicle Details</h3>
                        <p className="text-xs">Insurable value is based on SNK's master database.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            {field("*Make")}
                            <SearchableSelect value={make} onChange={setMake} options={makes.map(m => ({ value: m, label: m }))} placeholder="Select a make..." isLoading={makes.length === 0} />
                        </div>
                        <div>
                            {field("*Model")}
                            <SearchableSelect value={model} onChange={setModel} options={models.map(m => ({ value: m, label: m }))} placeholder="Select a model..." disabled={!make} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            {field("*Variant", loadingOptions)}
                            <FormSelect value={variant} onChange={(e) => setVariant(e.target.value)} disabled={!model || variants.length === 0} options={variants} />
                        </div>
                        <div>
                            {field("*Body Type")}
                            <FormSelect value={style} onChange={(e) => setStyle(e.target.value)} disabled={!variant || styles.length === 0} options={styles} />
                        </div>
                        <div>
                            {field("*Year")}
                            <FormSelect value={year} onChange={(e) => setYear(e.target.value)} disabled={!style || years.length === 0} options={years} />
                        </div>
                        <div>
                            {field("Import Status")}
                            <FormSelect value={importStatus} onChange={(e) => setImportStatus(e.target.value)} disabled={!year || specs.import_statuses.length === 0} options={specs.import_statuses} />
                        </div>
                        <div>
                            {field("Transmission")}
                            <FormSelect value={transmission} onChange={(e) => setTransmission(e.target.value)} disabled={!year || specs.transmissions.length === 0} options={specs.transmissions} />
                        </div>
                        <div>
                            {field("Engine Capacity (cc)")}
                            <FormSelect value={cc} onChange={(e) => setCc(e.target.value)} disabled={!year || specs.engine_ccs.length === 0} options={specs.engine_ccs.map(c => ({ value: c, label: `${c} cc` }))} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Button type="button" onClick={handleSubmit} disabled={searching} variant="secondary" size="sm" className="w-full text-lg md:text-xl flex justify-center gap-2">
                            {searching ? "Checking..." : "Get Insurable Value"} <ArrowDown className="h-5 w-5" />
                        </Button>
                        <Button type="button" onClick={resetAll} variant="secondary" size="sm" className="w-full text-lg md:text-xl flex justify-center items-center gap-2">
                            Reset <RotateCcw className="h-5 w-5" />
                        </Button>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                </form>
            </div>

            <div id="results">
                {result && (
                    <div className="rounded-2xl md:rounded-3xl border border-foreground/40 p-4 md:p-6 bg-brand-white flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-purple-100"><HandCoins className="w-5 h-5 text-purple-900" /></div>
                            <h3 className="text-lg md:text-xl font-bold">Insurable Value</h3>
                        </div>
                        <p className="text-sm text-brand-grey">{[make, model, variant, style, year].filter(Boolean).join(" · ")}</p>
                        {result.lowest ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                                <PriceContainer title="Lowest Insurable Value" price={formatPrice(result.lowest)} color="lowest" />
                                <PriceContainer title="Average Insurable Value" price={formatPrice(result.average)} color="average" />
                                <PriceContainer title="Highest Insurable Value" price={formatPrice(result.highest)} color="highest" />
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 py-6">No insurable value was found for this vehicle in our database.</p>
                        )}
                        <CheckOtherPrompt target="market" />
                    </div>
                )}
            </div>
            </>)}
        </ValuationPageShell>
    )
}
