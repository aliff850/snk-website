"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import { Button } from "../../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters, getEngineCcRangeFromLiterOption } from "../../ranges"

interface CarValuationFormProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function CarValuationForm({ onSearch, onReset, loading = false, onSearchStart }: CarValuationFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    // Existing states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    
    // Mudah state
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    // States for Mudah filters
    const [fromOffset, setFromOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(50)
    const [type, setType] = useState("sell")
    const [fueltype, setFueltype] = useState("")
    const [condition, setCondition] = useState("")
    const [origin, setOrigin] = useState("")
    const [transmission, setTransmission] = useState("")
    const [carType, setCarType] = useState("")
    const [engineCapacityLiter, setEngineCapacityLiter] = useState<string>("")
    const [yearFrom, setYearFrom] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    const [priceFrom, setPriceFrom] = useState<string>("")
    const [insuredPrice, setInsuredPrice] = useState<string>("")

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])
    const fieldsDisabled = !canSubmit

    // Fetch Mudah makes
    const fetchMakes = async () => {
        setLoadingMakes(true)
        try {
            const response = await fetch('/api/mudah/all_vehicles')
            if (response.ok) {
                const makes = await response.json()
                setAvailableMakes(makes)
            }
        } catch (e) {
            console.error('Failed to fetch makes:', e)
        } finally {
            setLoadingMakes(false)
        }
    }

    // Fetch Mudah models
    const fetchModels = async (makeSlug: string) => {
        try {
            const response = await fetch(`/api/mudah/all_vehicles?make=${encodeURIComponent(makeSlug)}`)
            if (response.ok) {
                const models = await response.json()
                setAvailableModels(models || {})
            }
        } catch (e) {
            console.error('Failed to fetch models:', e)
            setAvailableModels({})
        }
    }

    // Fetch Mudah makes on mount
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
        setFueltype("")
        setCondition("")
        setOrigin("")
        setTransmission("")
        setCarType("")
        setYearFrom("")
        setMileageFrom("")
        setPriceFrom("")
        setInsuredPrice("")
        setEngineCapacityLiter("")
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
                    make_id: makeSlug, 
                    model_id: modelSlug, 
                    From: fromOffset, 
                    limit, 
                    sortby: sortOrder,
                    type 
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
                if (fueltype) searchQuery.fueltype = fueltype

                // Engine capacity
                const engineCapacityCcRange = (() => {
                    if (!engineCapacityLiter) return null
                    const range = getEngineCcRangeFromLiterOption(engineCapacityLiter)
                    return range ? `${range.min}-${range.max}` : null
                })()

                // Mileage
                const mileageQuery = (() => {
                    const from = mileageFrom || ""
                    if (!from) return ""
                    const fromNum = parseInt(from, 10)
                    if (Number.isNaN(fromNum)) return ""

                    // Create a 5,000 KM window
                    const maxOption = mileageOptions.filter(v => v !== 'Any').map(Number).at(-1) ?? fromNum
                    const toNum = Math.min(fromNum + 5000, maxOption)

                    return `${from}-${toNum}`
                })()

                if (mileageQuery) searchQuery.mileage = mileageQuery
                if (carType) searchQuery.car_type_id = carType

                if (transmission) searchQuery.transmission_id = transmission
                const priceQuery = (() => {
                    const from = priceFrom || ""
                    if (!from) return ""
                    if (from) return `${from}-${from}`
                    return `${MIN_VALUES.price}-`
                })()

                if (priceQuery) searchQuery.price = priceQuery

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
                source: 'Mudah',
                userInputs: {
                    make: make,
                    model: model,
                    year: yearFrom,
                    bodyType: carType,
                    engineCapacity: engineCapacityLiter,
                    fuelType: fueltype,
                    transmission: transmission,
                    origin: origin,
                    condition: condition,
                    mileage: mileageFrom,
                    insuredPrice: insuredPrice,
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
                            <label className="block text-sm font-medium mb-1">*Year</label>
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
                            <label className="block text-sm font-medium mb-1">*Body Type</label>
                            <select 
                                value={carType} 
                                onChange={(e) => setCarType(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="sedan">Sedan</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="suvs">SUV</option>
                                <option value="mpvs">MPV</option>
                                <option value="coupe">Coupe</option>
                                <option value="sports">Sports</option>
                                <option value="pick_up">Pick-up</option>
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
                            <label className="block text-sm font-medium mb-1">*Engine Capacity (L)</label>
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
                            <label className="block text-sm font-medium mb-1">*Fuel Type</label>
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
                            <label className="block text-sm font-medium mb-1">*Transmission</label>
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
                            <label className="block text-sm font-medium mb-1">*Origin</label>
                            <select 
                                value={origin} 
                                onChange={(e) => setOrigin(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="New Local">New Local</option>
                                <option value="New Import">New Import</option>
                                <option value="Recon">Reconditioned</option>
                                <option value="CBU">CBU</option>
                                <option value="CKD">CKD</option>
                            </select>
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Condition & Value</h3>
                            <p className="text-xs text-foreground/60 mt-1">Usage and valuation data</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Condition</label>
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

