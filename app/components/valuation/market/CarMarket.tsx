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

type PathOption = { label: string; path: string }
type SlugOption = { label: string; slug: string }
interface Menu {
    makes: PathOption[]
    model_groups: PathOption[]
    models: PathOption[]
    variants: SlugOption[]
    body_types: SlugOption[]
    years: string[]
    transmissions: string[]
    fuel_types: string[]
}
const EMPTY_MENU: Menu = { makes: [], model_groups: [], models: [], variants: [], body_types: [], years: [], transmissions: [], fuel_types: [] }

// Shown as import status; the server maps each to the market source's listing conditions
const IMPORT_STATUSES = [{ value: "imported_new", label: "Imported New" }, { value: "local_assembled", label: "Local Assembled" }, { value: "imported_recon", label: "Imported Recon" }]
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
// Always A-Z (numbers in natural order: 1 SERIES, 2 SERIES... 10), never the source's own popularity order
const byLabel = <T extends { label: string }>(list: T[]) => [...list].sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }))
const toOptions = (list: PathOption[]) => byLabel(list).map(o => ({ value: o.path, label: o.label.toUpperCase() }))
const labelOf = (list: { label: string; path?: string; slug?: string }[], key: string) => list.find(o => (o.path ?? o.slug) === key)?.label || ""

// Car tab of the Current Market Valuation page. Each dropdown is the market source's own filter menu for the
// current step (Make -> Model Group, when the make has one -> Model -> Variant...), so the search matches exactly.
export function CarMarket() {
    const { refreshTokens, getAccessToken } = useAuth()

    const [makes, setMakes] = useState<PathOption[]>([])
    const [groups, setGroups] = useState<PathOption[]>([])
    const [models, setModels] = useState<PathOption[]>([])
    const [menu, setMenu] = useState<Menu>(EMPTY_MENU)

    const [make, setMake] = useState("")
    const [group, setGroup] = useState("")
    const [model, setModel] = useState("")
    const [variantSlug, setVariantSlug] = useState("")
    const [bodySlug, setBodySlug] = useState("")
    const [year, setYear] = useState("")
    const [transmission, setTransmission] = useState("")
    const [fuelType, setFuelType] = useState("")
    const [importStatus, setImportStatus] = useState("local_assembled")

    const [loadingStep, setLoadingStep] = useState<string | null>(null)
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<{ listings: any[]; asOf: string | null; userInputs: any } | null>(null)

    const loadMenu = async (path: string, step: string): Promise<Menu | null> => {
        setLoadingStep(step)
        try {
            const accessToken = await getAccessToken()
            const res = await fetch(`${API_BASE}/api/market/options/menu?path=${encodeURIComponent(path)}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) { setError(data?.detail || "Could not load the options. Please try again."); return null }
            setError(null)
            return { ...EMPTY_MENU, ...data }
        } catch {
            setError("Could not load the options. Please try again.")
            return null
        } finally {
            setLoadingStep(null)
        }
    }

    useEffect(() => {
        loadMenu("", "make").then(m => setMakes(m?.makes || []))
    }, [])

    // Make -> model groups (BMW, Mercedes-Benz...) or straight to models
    useEffect(() => {
        setGroups([]); setGroup(""); setModels([]); setModel("")
        if (!make) return
        let current = true
        loadMenu(make, "model").then(m => {
            if (!current || !m) return
            if (m.model_groups.length > 0) setGroups(m.model_groups)
            else setModels(m.models)
        })
        return () => { current = false }
    }, [make])

    // Model group -> the models in that group
    useEffect(() => {
        setModels(prev => groups.length > 0 ? [] : prev); setModel("")
        if (!group) return
        let current = true
        loadMenu(group, "model").then(m => { if (current && m) setModels(m.models) })
        return () => { current = false }
    }, [group])

    // Model -> variants, body types, years, transmissions, fuel types
    useEffect(() => {
        setMenu(EMPTY_MENU); setVariantSlug(""); setBodySlug(""); setYear(""); setTransmission(""); setFuelType("")
        if (!model) return
        let current = true
        loadMenu(model, "details").then(m => {
            if (!current || !m) return
            setMenu(m)
            if (m.variants.length === 1) setVariantSlug(m.variants[0].slug)
            if (m.body_types.length === 1) setBodySlug(m.body_types[0].slug)
        })
        return () => { current = false }
    }, [model])

    const makeLabel = labelOf(makes, make).toUpperCase()
    const groupLabel = labelOf(groups, group).toUpperCase()
    const modelLabel = [groupLabel, labelOf(models, model).toUpperCase()].filter(Boolean).join(" ")
    const variantLabel = labelOf(menu.variants, variantSlug)
    const bodyLabel = labelOf(menu.body_types, bodySlug)
    const importStatusLabel = IMPORT_STATUSES.find(s => s.value === importStatus)?.label || ""

    const resetAll = () => { setMake(""); setImportStatus("local_assembled"); setResults(null); setError(null) }

    const handleSubmit = async () => {
        if (!model) { setError("Please select the make and model."); return }
        setSearching(true); setError(null); setResults(null)
        try {
            const accessToken = await getAccessToken()
            if (!accessToken) { setError("Please log in again."); return }
            const res = await fetch(`${API_BASE}/api/valuation/market`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({
                    path: model,
                    import_status: importStatus,
                    variant_slug: variantSlug || null,
                    body_slug: bodySlug || null,
                    year: year ? parseInt(year) : null,
                    transmission: transmission || null,
                    fuel_type: fuelType || null,
                }),
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) { setError(data?.detail || "Something went wrong. Please try again."); return }
            await refreshTokens()

            const listings: any[] = Array.isArray(data.listings) ? data.listings : []
            const userInputs = {
                make: makeLabel, model: modelLabel, year, variant: variantLabel, style: bodyLabel,
                transmission: transmission ? capitalize(transmission) : "", fuelType, origin: importStatusLabel,
            }
            setResults({ listings, asOf: data.as_of, userInputs })

            // Same figures the results section shows: lowest, highest and the midpoint between them
            const prices = listings.map(l => Number(l.price)).filter(p => p > 0)
            if (prices.length > 0) {
                const lowest = Math.min(...prices), highest = Math.max(...prices)
                saveResult({
                    kind: 'market',
                    selections: [
                        { label: 'Type', value: 'Car' }, { label: 'Make', value: makeLabel }, { label: 'Model', value: modelLabel },
                        { label: 'Variant', value: variantLabel }, { label: 'Body Type', value: bodyLabel },
                        { label: 'Year', value: year }, { label: 'Import Status', value: importStatusLabel },
                    ],
                    lowest, highest, average: Math.round((lowest + highest) / 2),
                    date: data.as_of || new Date().toISOString(),
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

    const field = (text: string, loading?: boolean) => (
        <label className="block text-sm font-medium mb-1">{text} {loading && <span className="text-xs text-foreground/50">Loading...</span>}</label>
    )
    const detailsDisabled = !model || loadingStep === "details"

    return (
        <>
            <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                        <h3 className="text-lg font-bold text-brand">Vehicle Details</h3>
                        <p className="text-xs">Market value is based on vehicles currently listed for sale.</p>
                    </div>

                    <div className={`grid grid-cols-1 gap-4 ${groups.length > 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                        <div>
                            {field("*Make", loadingStep === "make")}
                            <SearchableSelect value={make} onChange={setMake} options={toOptions(makes)} placeholder="Select a make..." isLoading={loadingStep === "make"} />
                        </div>
                        {/* Only for makes the market source groups into model groups (e.g. BMW 1 Series) */}
                        {groups.length > 0 && (
                            <div>
                                {field("*Model Group")}
                                <SearchableSelect value={group} onChange={setGroup} options={toOptions(groups)} placeholder="Select a model group..." />
                            </div>
                        )}
                        <div>
                            {field("*Model", loadingStep === "model")}
                            <SearchableSelect value={model} onChange={setModel} options={toOptions(models)} placeholder="Select a model..." disabled={!make || (groups.length > 0 && !group)} isLoading={loadingStep === "model"} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            {field("Variant", loadingStep === "details")}
                            <FormSelect value={variantSlug} onChange={(e) => setVariantSlug(e.target.value)} disabled={detailsDisabled || menu.variants.length === 0} options={byLabel(menu.variants).map(v => ({ value: v.slug, label: v.label }))} />
                        </div>
                        <div>
                            {field("Body Type", loadingStep === "details")}
                            <FormSelect value={bodySlug} onChange={(e) => setBodySlug(e.target.value)} disabled={detailsDisabled || menu.body_types.length === 0} options={byLabel(menu.body_types).map(b => ({ value: b.slug, label: b.label }))} />
                        </div>
                        <div>
                            {field("Year", loadingStep === "details")}
                            <FormSelect value={year} onChange={(e) => setYear(e.target.value)} disabled={detailsDisabled || menu.years.length === 0} options={menu.years} />
                        </div>
                        <div>
                            {field("*Import Status")}
                            <FormSelect value={importStatus} onChange={(e) => setImportStatus(e.target.value || "local_assembled")} disabled={!model} options={IMPORT_STATUSES} />
                        </div>
                        <div>
                            {field("Transmission", loadingStep === "details")}
                            <FormSelect value={transmission} onChange={(e) => setTransmission(e.target.value)} disabled={detailsDisabled || menu.transmissions.length === 0} options={menu.transmissions.map(t => ({ value: t, label: capitalize(t) }))} />
                        </div>
                        {/* Only shown when the market source has more than one fuel type for this model */}
                        {menu.fuel_types.length > 1 && (
                            <div>
                                {field("Fuel Type")}
                                <FormSelect value={fuelType} onChange={(e) => setFuelType(e.target.value)} disabled={detailsDisabled} options={menu.fuel_types} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <Button type="button" onClick={handleSubmit} disabled={searching || loadingStep !== null} variant="secondary" size="sm" className="w-full text-lg md:text-xl flex justify-center gap-2">
                            {searching ? "Searching..." : "Get Market Value"} <ArrowDown className="h-5 w-5" />
                        </Button>
                        <Button type="button" onClick={resetAll} variant="secondary" size="sm" className="w-full text-lg md:text-xl flex justify-center items-center gap-2">
                            Reset <RotateCcw className="h-5 w-5" />
                        </Button>
                    </div>
                    {loadingStep && <p className="text-sm text-center text-foreground/60">Loading the options. The first time this vehicle is chosen it can take up to a minute.</p>}
                    {searching && <p className="text-sm text-center text-foreground/60">This can take up to a minute when the listings have not been checked recently.</p>}
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                </form>
            </div>

            <div id="results">
                {results && (
                    <div className="rounded-2xl md:rounded-3xl border border-foreground/40 p-4 md:p-6 bg-brand-white flex flex-col gap-4">
                        {results.asOf && (
                            <p className="text-xs text-brand-grey text-right">Listings as of {new Date(results.asOf).toLocaleString()}</p>
                        )}
                        <UnifiedListingsDisplay listings={results.listings} userInputs={results.userInputs} showInsurable={false} />
                        <CheckOtherPrompt target="insurable" />
                    </div>
                )}
            </div>
        </>
    )
}
