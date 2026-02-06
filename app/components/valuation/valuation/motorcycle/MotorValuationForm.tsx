"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import { Button } from "../../../ui/button"
import { yearOptions, MIN_VALUES } from "../../ranges"
import SearchableSelect from '@/app/components/ui/SearchableSelect'

interface MotorValuationFormProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function MotorValuationForm({ onSearch, onReset, loading = false, onSearchStart }: MotorValuationFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    // Existing states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [region, setRegion] = useState("west")

    // Mudah state
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    // States for Mudah filters
    const [fromOffset, setFromOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(50)
    const [type, setType] = useState<"sell" | "buy">("sell") // Just set  listing type query to sell
    const [yearFrom, setYearFrom] = useState<string>("")
    // const [priceFrom, setPriceFrom] = useState<string>("")
    const [insuredPrice, setInsuredPrice] = useState<string>("")
    // Sets the condition of the motorcycle
    const [condition, setCondition] = useState("")

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])
    const fieldsDisabled = !canSubmit

    // Fetch Mudah motorcycle makes
    const fetchMakes = async () => {
        setLoadingMakes(true)
        try {
            const response = await fetch('/api/mudah/all_motorcycles')
            if (response.ok) {
                const makes = await response.json()
                setAvailableMakes(makes)
            }
        } catch (e) {
            console.error('Failed to fetch motorcycle makes:', e)
        } finally {
            setLoadingMakes(false)
        }
    }

    // Fetch Mudah motorcycle models
    const fetchModels = async (makeSlug: string) => {
        try {
            const response = await fetch(`/api/mudah/all_motorcycles?make=${encodeURIComponent(makeSlug)}`)
            if (response.ok) {
                const models = await response.json()
                setAvailableModels(models || {})
            }
        } catch (e) {
            console.error('Failed to fetch motorcycle models:', e)
            setAvailableModels({})
        }
    }

    // Fetch Mudah motorcycle makes on mount
    useEffect(() => {
        fetchMakes()
    }, [])

    // resets all
    const resetAll = () => {
        setMake("")
        setModel("")
        setFromOffset(0)
        setLimit(50)
        setType("sell")
        setYearFrom("")
        setInsuredPrice("")
        // setPriceFrom("")
        if (onReset) {
            onReset()
        }
    }

    const getMudahData = async () => {
        if (!canSubmit) return

        setIsLoading(true)
        if (onSearchStart) {
            onSearchStart()
        }

        try {
            const makeSlug = slug(make)
            const modelSlug = slug(model)
            const headers = { "Content-Type": "application/json" }

            // Helper function to fetch listings
            const fetchListings = async (sortOrder: 'price_asc' | 'price_desc') => {
                const searchQuery: Record<string, any> = {
                    motorcycle_make_id: makeSlug,
                    motorcycle_model_id: modelSlug,
                    From: fromOffset,
                    limit,
                    sortby: sortOrder
                    // type 
                }

                // building the range filters
                // Model year
                const yearQuery = (() => {
                    const from = yearFrom || ""
                    if (!from) return ""
                    if (from) return `${from}-${from}`
                    return `${MIN_VALUES.year}-`
                })()

                if (yearQuery) searchQuery.mfg_year = yearQuery

                // Price
                // const priceQuery = (() => {
                //     const from = priceFrom || ""
                //     if (!from) return ""
                //     if (from) return `${from}-${from}`
                //     return `${MIN_VALUES.price}-`
                // })()

                // if (priceQuery) searchQuery.price = priceQuery

                const response = await fetch(`/api/mudah/search`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ searchQuery })
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`Failed to fetch Mudah Listings: ${response.status} - ${errorText}`)
                }

                return await response.json()
            }

            // Fetch all listings
            const ascendingListings = await fetchListings('price_asc')

            let descendingListings: any[] = []
            let uniqueAscending: any[] = []
            let uniqueDescending: any[] = []

            // If less than 50 listings, use only ascending
            if (ascendingListings.length < 50) {
                uniqueAscending = ascendingListings
                uniqueDescending = []
            } else {
                // If we got 50 or more, also fetch descending
                descendingListings = await fetchListings('price_desc')

                // create a map using adview_url as the key to deduplicate
                const listingsMap: Record<string, any> = {}

                // Add ascending listings
                ascendingListings.forEach((listing: any) => {
                    if (listing.adview_url) {
                        listingsMap[listing.adview_url] = listing
                    }
                })

                // Add descending listings
                descendingListings.forEach((listing: any) => {
                    if (listing.adview_url) {
                        listingsMap[listing.adview_url] = listing
                    }
                })
                // convert map values to arrays and sort
                const allListings = Object.values(listingsMap)
                uniqueAscending = [...allListings].sort((a: any, b: any) => a.price - b.price)
                uniqueDescending = [...allListings].sort((a: any, b: any) => b.price - a.price)
            }

            const results = {
                listings: uniqueAscending,
                listingsAscending: uniqueAscending,
                listingsDescending: uniqueDescending,
                make: makeSlug,
                model: modelSlug,
                vehicleType: 'motorcycle',
                source: 'Mudah',
                userInputs: {
                    make: make,
                    model: model,
                    region: region,
                    year: yearFrom,
                    condition: condition,
                    insuredPrice: insuredPrice
                }
            }

            onSearch(results)
        } catch (e: any) {
            onSearch({ error: e?.message || "Something went wrong" })
        } finally {
            setIsLoading(false)
        }
    }

    const makeOptions = useMemo(() =>
        Object.keys(availableMakes).map(makeKey => ({
            value: makeKey,
            label: makeKey.replace(/-/g, ' ').toUpperCase()
        })),
        [availableMakes])

    const modelOptions = useMemo(() =>
        Object.keys(availableModels)
            .filter(modelKey => modelKey !== '@id')
            .map(modelKey => ({
                value: modelKey,
                label: modelKey.replace(/-/g, ' ').toUpperCase()
            })),
        [availableModels])

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Make model and region */}
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="col-span-2 flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Motorcycle Make/Model</h3>
                            <p className="text-xs text-foreground">Select the make and model of the vehicle and also the region</p>
                        </div>

                        <div>
                            <label className="block font-medium text-brand">*Make</label>
                            <SearchableSelect
                                value={make}
                                onChange={(value) => {
                                    setMake(value)
                                    if (value) {
                                        fetchModels(slug(value))
                                    } else {
                                        setAvailableModels({})
                                    }
                                }}
                                options={makeOptions}
                                placeholder="Select a make..."
                                disabled={loadingMakes}
                            />
                            {loadingMakes && <p className="mt-1 text-xs text-foreground/60">Loading makes...</p>}
                        </div>

                        <div>
                            <label className="block font-medium text-brand">*Model</label>
                            <SearchableSelect
                                value={model}
                                onChange={(value) => setModel(value)}
                                options={modelOptions}
                                placeholder="Select a model..."
                                disabled={!make || Object.keys(availableModels).length === 0}
                            />
                            {make && Object.keys(availableModels).length === 0 && !loadingMakes && (
                                <p className="mt-1 text-xs text-foreground/60">No models found for this make</p>
                            )}
                        </div>

                        {/* Option to change between East and West Malaysia */}
                        <div className="col-span-2 flex flex-col gap-2 border-b-2 border-brand/20 pb-4">
                            <label className="font-medium text-brand">*Region</label>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="west"
                                        name="region"
                                        value="west"
                                        checked={region === 'west'}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-4 h-4 accent-brand"
                                    />
                                    <label htmlFor="west">West Malaysia</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="east"
                                        name="region"
                                        value="east"
                                        checked={region === 'east'}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-4 h-4 accent-brand"
                                    />
                                    <label htmlFor="east">East Malaysia</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle identity */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20 flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs">Basic vehicle information</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">*Year</label>
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


                    </div>

                    {/* Search filters */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20 flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-brand">Condition & Value</h3>
                            <p className="text-xs">Usage and valuation data</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">*Condition</label>
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="Very Poor">Very Poor</option>
                                <option value="Poor">Poor</option>
                                <option value="Fair">Fair</option>
                                <option value="Good">Good</option>
                                <option value="Very Good">Very Good</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Previous Insured Sum (MYR)</label>
                            <input
                                type="number"
                                max={9999999}
                                placeholder="E.g. 123456"
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
                                onClick={() => {
                                    getMudahData()
                                }}
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

