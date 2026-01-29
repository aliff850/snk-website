"use client"
// THIS COMPONENT IS NOT IN USE
import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import { Button } from "../../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters, getEngineCcRangeFromLiterOption } from "../../ranges"

interface CarValuationAggProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function CarValuationAgg({ onSearch, onReset, loading = false, onSearchStart }: CarValuationAggProps) {
    const [isLoading, setIsLoading] = useState(false)

    // Source selection state
    const [sources, setSources] = useState<('mudah' | 'carlist')[]>(['mudah', 'carlist'])

    // Existing states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")

    // Vehicle maps state
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    // Filter states
    const [fueltype, setFueltype] = useState("")
    const [condition, setCondition] = useState("")
    const [transmission, setTransmission] = useState("")
    const [carType, setCarType] = useState("")
    const [engineCapacityLiter, setEngineCapacityLiter] = useState<string>("")
    const [yearFrom, setYearFrom] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [insuredPrice, setInsuredPrice] = useState<string>("")

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim() && sources.length > 0, [make, model, sources])
    const fieldsDisabled = !canSubmit

    // Toggle source selection
    const toggleSource = (source: 'mudah' | 'carlist') => {
        setSources(prev => {
            if (prev.includes(source)) {
                // Don't allow removing if it's the last one
                return prev.length === 1 ? prev : prev.filter(s => s !== source)
            } else {
                return [...prev, source]
            }
        })
    }

    // Fetch makes
    const fetchMakes = async () => {
        setLoadingMakes(true)
        try {
            const response = await fetch('/api/utils/supported_makes')
            if (response.ok) {
                const data = await response.json()
                // Convert array to object format for compatibility
                const makesObj: Record<string, any> = {}
                data.makes.forEach((make: string) => {
                    makesObj[make] = {}
                })
                setAvailableMakes(makesObj)
            }
        } catch (e) {
            console.error('Failed to fetch makes:', e)
            // Fallback to Mudah endpoint
            try {
                const response = await fetch('/api/mudah/all_vehicles')
                if (response.ok) {
                    const makes = await response.json()
                    setAvailableMakes(makes)
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError)
            }
        } finally {
            setLoadingMakes(false)
        }
    }

    // Fetch models
    const fetchModels = async (makeSlug: string) => {
        try {
            const response = await fetch(`/api/utils/supported_models/${encodeURIComponent(makeSlug)}`)
            if (response.ok) {
                const data = await response.json()
                // Convert array to object format
                const modelsObj: Record<string, string> = {}
                data.models.forEach((model: string) => {
                    modelsObj[model] = model
                })
                setAvailableModels(modelsObj || {})
            }
        } catch (e) {
            console.error('Failed to fetch models:', e)
            // Fallback to Mudah endpoint
            try {
                const response = await fetch(`/api/mudah/all_vehicles?make=${encodeURIComponent(makeSlug)}`)
                if (response.ok) {
                    const models = await response.json()
                    setAvailableModels(models || {})
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError)
                setAvailableModels({})
            }
        }
    }

    // Fetch makes on mount
    useEffect(() => {
        fetchMakes()
    }, [])

    // Reset all fields
    const resetAll = () => {
        setMake("")
        setModel("")
        setSources(['mudah', 'carlist'])
        setFueltype("")
        setCondition("")
        setTransmission("")
        setCarType("")
        setYearFrom("")
        setMileageFrom("")
        setMinPrice("")
        setMaxPrice("")
        setInsuredPrice("")
        setEngineCapacityLiter("")
        if (onReset) {
            onReset()
        }
    }

    // Unified search function
    const getUnifiedData = async () => {
        if (!canSubmit) return

        setIsLoading(true)
        if (onSearchStart) {
            onSearchStart()
        }

        try {
            const makeSlug = slug(make)
            const modelSlug = slug(model)

            // Build unified query
            const searchQuery: Record<string, any> = {
                make: makeSlug,
                model: modelSlug,
                sources: sources,
                limit: 50
            }

            // Add optional filters
            if (yearFrom) searchQuery.year = yearFrom
            if (transmission) searchQuery.transmission = transmission
            if (fueltype) searchQuery.fuel_type = fueltype
            if (condition) searchQuery.condition = condition
            if (carType) searchQuery.body_type = carType

            // Mileage range
            if (mileageFrom) {
                const fromNum = parseInt(mileageFrom, 10)
                if (!Number.isNaN(fromNum)) {
                    searchQuery.min_mileage = fromNum
                    const maxOption = mileageOptions.filter(v => v !== 'Any').map(Number).at(-1) ?? fromNum
                    searchQuery.max_mileage = Math.min(fromNum + 5000, maxOption)
                }
            }

            // Price range
            if (minPrice) searchQuery.min_price = parseInt(minPrice, 10)
            if (maxPrice) searchQuery.max_price = parseInt(maxPrice, 10)

            // Call unified endpoint
            const response = await fetch('/api/utils/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchQuery)
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to fetch listings: ${response.status} - ${errorText}`)
            }

            const data = await response.json()

            // Format results to match existing structure
            const results = {
                listings: data.listings,
                listingsAscending: data.listings_ascending,
                listingsDescending: data.listings_descending,
                make: makeSlug,
                model: modelSlug,
                vehicleType: 'car',
                source: sources.length === 2 ? 'Unified' : sources[0].charAt(0).toUpperCase() + sources[0].slice(1),
                sources: data.sources,
                statistics: data.statistics,
                userInputs: {
                    make: make,
                    model: model,
                    year: yearFrom,
                    bodyType: carType,
                    engineCapacity: engineCapacityLiter,
                    fuelType: fueltype,
                    transmission: transmission,
                    condition: condition,
                    mileage: mileageFrom,
                    insuredPrice: insuredPrice,
                    sources: sources
                }
            }

            onSearch(results)
        } catch (e: any) {
            onSearch({ error: e?.message || "Something went wrong" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {/* Source Selection Toggle */}
                <div className="mb-4 p-4 bg-brand/5 rounded-xl border border-brand/20">
                    <label className="block text-sm font-semibold mb-3 text-brand">Data Sources</label>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => toggleSource('mudah')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${sources.includes('mudah')
                                ? 'bg-brand text-white shadow-md'
                                : 'bg-white text-foreground/60 border border-foreground/20 hover:border-brand/40'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${sources.includes('mudah') ? 'bg-white' : 'bg-foreground/30'}`} />
                                Mudah.my
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleSource('carlist')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${sources.includes('carlist')
                                ? 'bg-brand text-white shadow-md'
                                : 'bg-white text-foreground/60 border border-foreground/20 hover:border-brand/40'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${sources.includes('carlist') ? 'bg-white' : 'bg-foreground/30'}`} />
                                Carlist.my
                            </span>
                        </button>
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">
                        {sources.length === 2
                            ? "Searching both platforms for comprehensive results"
                            : sources.length === 1
                                ? `Searching ${sources[0].charAt(0).toUpperCase() + sources[0].slice(1)}.my only`
                                : "Select at least one source"}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Vehicle identity */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs text-foreground/60 mt-1">Basic vehicle information</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Make</label>
                            <select
                                value={make}
                                onChange={(e) => {
                                    setMake(e.target.value)
                                    if (e.target.value) {
                                        fetchModels(slug(e.target.value))
                                    } else {
                                        setAvailableModels({})
                                    }
                                }}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                disabled={loadingMakes}
                            >
                                <option value="">Select a make...</option>
                                {Object.keys(availableMakes).map(makeKey => (
                                    <option key={makeKey} value={makeKey}>{makeKey.replace(/-/g, ' ').toUpperCase()}</option>
                                ))}
                            </select>
                            {loadingMakes && <p className="mt-1 text-xs text-foreground/60">Loading makes...</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Model</label>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                                disabled={!make || Object.keys(availableModels).length === 0}
                            >
                                <option value="">Select a model...</option>
                                {Object.keys(availableModels)
                                    .filter(modelKey => modelKey !== '__id__')
                                    .map(modelKey => (
                                        <option key={modelKey} value={modelKey}>{modelKey.replace(/-/g, ' ').toUpperCase()}</option>
                                    ))}
                            </select>
                            {make && Object.keys(availableModels).length === 0 && !loadingMakes && (
                                <p className="mt-1 text-xs text-foreground/60">No models found for this make</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <select
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                {yearOptions.filter(v => v !== 'Any').map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Body Type</label>
                            <select
                                value={carType}
                                onChange={(e) => setCarType(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="sedan">Sedan</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="suv">SUV</option>
                                <option value="mpv">MPV</option>
                                <option value="coupe">Coupe</option>
                                <option value="sports">Sports</option>
                                <option value="pickup">Pick-up</option>
                                <option value="4_wheels">4-Wheels</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Technical specifications */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Technical Specifications</h3>
                            <p className="text-xs text-foreground/60 mt-1">Engine and performance details</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Engine Capacity (L)</label>
                            <select
                                value={engineCapacityLiter}
                                onChange={(e) => setEngineCapacityLiter(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                {engineCapacityOptionsLiters.filter(v => v !== 'Any').map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Fuel Type</label>
                            <select
                                value={fueltype}
                                onChange={(e) => setFueltype(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="petrol">Petrol</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Transmission</label>
                            <select
                                value={transmission}
                                onChange={(e) => setTransmission(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="auto">Auto</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Condition</label>
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="new">New</option>
                                <option value="used">Used</option>
                                <option value="recon">Reconditioned</option>
                            </select>
                        </div>
                    </div>

                    {/* Condition & Value */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Usage & Pricing</h3>
                            <p className="text-xs text-foreground/60 mt-1">Mileage and price ranges</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mileage (KM)</label>
                            <select
                                value={mileageFrom}
                                onChange={(e) => setMileageFrom(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                {mileageOptions.filter(v => v !== 'Any').map(m => (
                                    <option key={m} value={m}>{Number(m).toLocaleString()}+</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Min Price (MYR)</label>
                            <input
                                type="number"
                                max={9999999}
                                placeholder="30000"
                                disabled={fieldsDisabled}
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Max Price (MYR)</label>
                            <input
                                type="number"
                                max={9999999}
                                placeholder="100000"
                                disabled={fieldsDisabled}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Previous Insured Sum (MYR)</label>
                            <input
                                type="number"
                                max={9999999}
                                placeholder="88888"
                                disabled={fieldsDisabled}
                                value={insuredPrice}
                                onChange={(e) => setInsuredPrice(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div>
                    </div>

                    <div className="col-span-full flex pt-4 lg:pt-0 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                            <Button
                                type="button"
                                href="#valuation"
                                onClick={getUnifiedData}
                                disabled={!canSubmit || loading || isLoading}
                                variant="secondary"
                                size="sm"
                                className="w-full text-lg md:text-xl flex justify-center gap-2"
                            >
                                Get Market Value
                                <ArrowDown className="h-5 w-5" />
                            </Button>
                            <Button
                                type="button"
                                href="#main"
                                onClick={resetAll}
                                variant="secondary"
                                size="sm"
                                className="w-full text-lg md:text-xl flex justify-center items-center gap-2"
                            >
                                Reset
                                <RotateCcw className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}