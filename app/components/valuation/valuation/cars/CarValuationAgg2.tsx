"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import { Button } from "../../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters, getEngineCcRangeFromLiterOption } from "../../ranges"

interface CarValuationMultiProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function CarValuationMulti({ onSearch, onReset, loading = false, onSearchStart }: CarValuationMultiProps) {
    const [isLoading, setIsLoading] = useState(false)
    
    // Source selection (Mudah is default) - mutually exclusive
    const [source, setSource] = useState<'mudah' | 'carlist'>('mudah')
    
    // Shared states
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

    // Carlist state
    const [carlistMakes, setCarlistMakes] = useState<Record<string, any>>({})
    const [carlistModels, setCarlistModels] = useState<Record<string, string | null>>({})
    const [loadingCarlistMakes, setLoadingCarlistMakes] = useState(false)
    
    // States for Carlist filters
    // const [carlistCondition, setCarlistCondition] = useState("")
    const [carlistVariant, setCarlistVariant] = useState("")
    const [carlistBodyType, setCarlistBodyType] = useState("")
    const [carlistTransmission, setCarlistTransmission] = useState("")
    const [carlistFuelType, setCarlistFuelType] = useState("")
    const [carlistDrivenWheel, setCarlistDrivenWheel] = useState("")
    const [carlistMinPrice, setCarlistMinPrice] = useState<string>("")
    const [carlistMaxPrice, setCarlistMaxPrice] = useState<string>("")
    const [carlistMinMileage, setCarlistMinMileage] = useState<string>("")
    const [carlistMaxMileage, setCarlistMaxMileage] = useState<string>("")
    const [carlistSort, setCarlistSort] = useState<string>("")

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

    // Fetch Carlist makes
    const fetchCarlistMakes = async () => {
        setLoadingCarlistMakes(true)
        try {
            const response = await fetch('/api/carlist/all_vehicles')
            if (response.ok) {
                const makes = await response.json()
                setCarlistMakes(makes)
            }
        } catch (e) {
            console.error('Failed to fetch Carlist makes:', e)
        } finally {
            setLoadingCarlistMakes(false)
        }
    }

    // Fetch Carlist models
    const fetchCarlistModels = async (makeSlug: string) => {
        try {
            const response = await fetch(`/api/carlist/all_vehicles?make=${encodeURIComponent(makeSlug)}`)
            if (response.ok) {
                const models = await response.json()
                setCarlistModels(models || {})
            }
        } catch (e) {
            console.error('Failed to fetch Carlist models:', e)
            setCarlistModels({})
        }
    }

    // Fetch makes on mount
    useEffect(() => {
        fetchMakes()
        fetchCarlistMakes()
    }, [])

    // Refetch models when source changes if make is already selected
    useEffect(() => {
        if (make) {
            const makeSlug = slug(make)
            if (source === 'mudah') fetchModels(makeSlug)
            if (source === 'carlist') fetchCarlistModels(makeSlug)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source])

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
        // Reset Carlist fields
        // setCarlistCondition("")
        setCarlistVariant("")
        setCarlistBodyType("")
        setCarlistTransmission("")
        setCarlistFuelType("")
        setCarlistDrivenWheel("")
        setCarlistMinPrice("")
        setCarlistMaxPrice("")
        setCarlistMinMileage("")
        setCarlistMaxMileage("")
        setCarlistSort("")
        setCarlistModels({})
        if (onReset) {
            onReset()
        }
    }

    const getCarlistData = async () => {
        if (!canSubmit) return
        
        try {
            const makeSlug = slug(make)
            const modelSlug = slug(model)
            const headers = { "Content-Type": "application/json" }
    
            const query: Record<string, any> = {
                make: makeSlug,
                model: modelSlug,
                condition: 'used' // Default to 'used' as shown in the schema example
            }
            
            if (carlistVariant) query.variant = carlistVariant
            if (carlistBodyType) {
                // Map form values to API expected values (API expects specific casing)
                const bodyTypeMap: Record<string, string> = {
                    'sedan': 'sedan',
                    'suv': 'suv',
                    'MPV': 'MPV',
                    'Hatchback': 'Hatchback',
                    'Coupe': 'Coupe',
                    'pickup': 'pickup',
                    'Convertible': 'Convertible',
                    'wagon': 'wagon',
                    'van': 'van'
                }
                const mappedBodyType = bodyTypeMap[carlistBodyType] || carlistBodyType
                query.body_type = mappedBodyType
            }
    
            const baseFilters: Record<string, any> = {
                page_size: 50
            }
            
            if (carlistTransmission) baseFilters.transmission = carlistTransmission
            if (carlistFuelType) baseFilters.fuel_type = carlistFuelType
            if (carlistDrivenWheel) baseFilters.driven_wheel = carlistDrivenWheel
            if (carlistMinPrice) baseFilters.min_price = parseInt(carlistMinPrice, 10)
            if (carlistMaxPrice) baseFilters.max_price = parseInt(carlistMaxPrice, 10)
            if (carlistMinMileage) baseFilters.min_mileage = parseInt(carlistMinMileage, 10)
            if (carlistMaxMileage) baseFilters.max_mileage = parseInt(carlistMaxMileage, 10)
    
            // Fetch ascending
            const ascFilters = { ...baseFilters, sort: 'asc' }
            const requestBody = {
                query,
                filters: ascFilters,
                whitelist_attributes: [
                    "brand.name",
                    "model",
                    "itemCondition",
                    "vehicleModelDate",
                    "fuelType",
                    "offers.price",
                    "mileageFromOdometer.value",
                    "vehicleTransmission"
                ]
            }
            
            // Debug: log the request body to verify it matches the schema
            console.log('Carlist Request Body:', JSON.stringify(requestBody, null, 2))
            
            const ascResponse = await fetch(`/api/carlist/search`, { 
                method: "POST", 
                headers, 
                body: JSON.stringify(requestBody) 
            })
    
            if (!ascResponse.ok) {
                const errorText = await ascResponse.text()
                throw new Error(`Failed to fetch Carlist Listings (asc): ${ascResponse.status} - ${errorText}`)
            }
    
            const ascListings = await ascResponse.json()
    
            // Only fetch descending if we got 50 listings (indicating there might be more)
            let descListings: any[] = []
            let uniqueAscending: any[] = []
            let uniqueDescending: any[] = []
    
            if (ascListings.length < 50) {
                // Less than 50 results, just use ascending
                uniqueAscending = ascListings
                uniqueDescending = [...ascListings].reverse()
            } else {
                // Fetch descending as well
                const descFilters = { ...baseFilters, sort: 'desc' }
                const descRequestBody = {
                    query,
                    filters: descFilters,
                    whitelist_attributes: [
                        "brand.name",
                        "model",
                        "itemCondition",
                        "vehicleModelDate",
                        "fuelType",
                        "offers.price",
                        "mileageFromOdometer.value",
                        "vehicleTransmission"
                    ]
                }
                const descResponse = await fetch(`/api/carlist/search`, { 
                    method: "POST", 
                    headers, 
                    body: JSON.stringify(descRequestBody) 
                })
    
                if (!descResponse.ok) {
                    // If descending fails, just use ascending
                    console.warn('Failed to fetch descending Carlist listings, using ascending only')
                    uniqueAscending = ascListings
                    uniqueDescending = [...ascListings].reverse()
                } else {
                    descListings = await descResponse.json()
    
                    // Deduplicate using a combination of fields as unique identifier
                    const listingsMap: Record<string, any> = {}
                    
                    // Add ascending listings
                    ascListings.forEach((listing: any) => {
                        // Create unique key from multiple fields
                        const key = `${listing['brand.name']}-${listing['model']}-${listing['offers.price']}-${listing['vehicleModelDate']}`
                        listingsMap[key] = listing
                    })
                    
                    // Add descending listings
                    descListings.forEach((listing: any) => {
                        const key = `${listing['brand.name']}-${listing['model']}-${listing['offers.price']}-${listing['vehicleModelDate']}`
                        listingsMap[key] = listing
                    })
    
                    // Convert map values to arrays and sort
                    const allListings = Object.values(listingsMap)
                    uniqueAscending = [...allListings].sort((a: any, b: any) => {
                        const priceA = a['offers.price'] || 0
                        const priceB = b['offers.price'] || 0
                        return priceA - priceB
                    })
                    uniqueDescending = [...allListings].sort((a: any, b: any) => {
                        const priceA = a['offers.price'] || 0
                        const priceB = b['offers.price'] || 0
                        return priceB - priceA
                    })
                }
            }
    
            return {
                listings: uniqueAscending,
                listingsAscending: uniqueAscending,
                listingsDescending: uniqueDescending,
                make: makeSlug, 
                model: modelSlug,
                vehicleType: 'car',
                source: 'Carlist',
                userInputs: {
                    make: make,
                    model: model,
                    // condition: carlistCondition,
                    variant: carlistVariant,
                    bodyType: carlistBodyType,
                    transmission: carlistTransmission,
                    fuelType: carlistFuelType,
                    drivenWheel: carlistDrivenWheel,
                    minPrice: carlistMinPrice,
                    maxPrice: carlistMaxPrice,
                    minMileage: carlistMinMileage,
                    maxMileage: carlistMaxMileage,
                }
            }
        } catch (e: any) {
            throw new Error(e?.message || "Something went wrong with Carlist")
        }
    }

    const getMudahData = async () => {
        if (!canSubmit) return
        
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

            return {
                listings: uniqueAscending,
                listingsAscending: uniqueAscending,
                listingsDescending: uniqueDescending,
                make: makeSlug, 
                model: modelSlug,
                vehicleType: 'car',
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
        } catch (e: any) {
            throw new Error(e?.message || "Something went wrong with Mudah")
        }
    }

    const handleSubmit = async () => {
        if (!canSubmit) return
    
        setIsLoading(true)
        if (onSearchStart) {
            onSearchStart()
        }
        
        try {
            const results: any[] = []
            const errors: string[] = []

            // Fetch from selected source
            if (source === 'mudah') {
                try {
                    const mudahResult = await getMudahData()
                    results.push(mudahResult)
                } catch (e: any) {
                    errors.push(`Mudah: ${e?.message || "Unknown error"}`)
                }
            }

            if (source === 'carlist') {
                try {
                    const carlistResult = await getCarlistData()
                    results.push(carlistResult)
                } catch (e: any) {
                    errors.push(`Carlist: ${e?.message || "Unknown error"}`)
                }
            }

            if (results.length === 0) {
                onSearch({ error: errors.join('; ') || "No results from source" })
                return
            }

            // Single source result (mutually exclusive selection)
            const result = results[0]
            onSearch({
                ...result,
                counts: {
                    [result.source.toLowerCase()]: result.listings.length,
                    total: result.listings.length
                }
            })
        } catch (e: any) {
            onSearch({ error: e?.message || "Something went wrong" })
        } finally {
            setIsLoading(false)
        }
    }

    const showMudah = source === 'mudah'
    const showCarlist = source === 'carlist'

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {/* Source Toggle */}
                <div className="p-4 outline-1 outline-foreground/40 rounded-xl md:rounded-2xl bg-foreground/5">
                    <div className="flex flex-col gap-3">
                        <label className="font-medium text-brand font-bold">Data Source</label>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setSource('mudah')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    source === 'mudah'
                                        ? 'bg-brand text-white'
                                        : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                                }`}
                            >
                                Mudah
                            </button>
                            <button
                                type="button"
                                onClick={() => setSource('carlist')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    source === 'carlist'
                                        ? 'bg-brand text-white'
                                        : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                                }`}
                            >
                                Carlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Make/Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b-2 border-brand/20">
                    <div>
                        <label className="block text-brand font-medium mb-1">*Make</label>
                        <select 
                            value={make} 
                            onChange={(e) => {
                                setMake(e.target.value)
                                if (e.target.value) {
                                    const makeSlug = slug(e.target.value)
                                    if (source === 'mudah') fetchModels(makeSlug)
                                    if (source === 'carlist') fetchCarlistModels(makeSlug)
                                } else {
                                    setAvailableModels({})
                                    setCarlistModels({})
                                }
                            }} 
                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                            disabled={loadingMakes || loadingCarlistMakes}
                        >
                            <option value="">Select a make...</option>
                            {(() => {
                                const makes: string[] = []
                                if (source === 'mudah') makes.push(...Object.keys(availableMakes))
                                if (source === 'carlist') makes.push(...Object.keys(carlistMakes))
                                return makes
                                    .filter((key, index, self) => self.indexOf(key) === index)
                                    .map(makeKey => (
                                        <option key={makeKey} value={makeKey}>
                                            {makeKey.replace(/-/g, ' ').toUpperCase()}
                                        </option>
                                    ))
                            })()}
                        </select>
                        {(loadingMakes || loadingCarlistMakes) && (
                            <p className="mt-1 text-xs text-foreground/60">Loading makes...</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-brand font-medium mb-1">*Model</label>
                        <select 
                            value={model} 
                            onChange={(e) => setModel(e.target.value)} 
                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            disabled={!make || (Object.keys(availableModels).length === 0 && Object.keys(carlistModels).length === 0)}
                        >
                            <option value="">Select a model...</option>
                            {(() => {
                                const models: string[] = []
                                if (source === 'mudah') {
                                    models.push(...Object.keys(availableModels).filter(k => k !== '__id__'))
                                }
                                if (source === 'carlist') {
                                    models.push(...Object.keys(carlistModels))
                                }
                                return models
                                    .filter((key, index, self) => self.indexOf(key) === index)
                                    .map(modelKey => (
                                        <option key={modelKey} value={modelKey}>
                                            {modelKey.replace(/-/g, ' ').toUpperCase()}
                                        </option>
                                    ))
                            })()}
                        </select>
                        {make && Object.keys(availableModels).length === 0 && Object.keys(carlistModels).length === 0 && !loadingMakes && !loadingCarlistMakes && (
                            <p className="mt-1 text-xs text-foreground/60">No models found for this make</p>
                        )}
                    </div>
                </div>

                {/* Mudah Query */}
                {showMudah && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Vehicle identity */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs text-foreground/60 mt-1">Basic vehicle information</p>
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

                </div>
                )}

                {/* Carlist Query */}
                {showCarlist && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Vehicle identity */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs text-foreground/60 mt-1">Basic vehicle information</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Year</label>
                            <select 
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                disabled
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                {yearOptions.filter(v => v !== 'Any').map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Variant</label>
                            <input 
                                type="text" 
                                placeholder="e.g., 1.5G" 
                                disabled
                                value={carlistVariant}
                                onChange={(e) => setCarlistVariant(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Body Type</label>
                            <select 
                                value={carlistBodyType} 
                                onChange={(e) => setCarlistBodyType(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="MPV">MPV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Coupe">Coupe</option>
                                <option value="pickup">Pickup</option>
                                <option value="Convertible">Convertible</option>
                                <option value="wagon">Wagon</option>
                                <option value="van">Van</option>
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
                            <label className="block text-sm font-medium mb-1">*Transmission</label>
                            <select 
                                value={carlistTransmission} 
                                onChange={(e) => setCarlistTransmission(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Fuel Type</label>
                            <select 
                                value={carlistFuelType} 
                                onChange={(e) => setCarlistFuelType(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                                <option value="Unleaded">Unleaded</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Driven Wheel</label>
                            <select 
                                value={carlistDrivenWheel} 
                                onChange={(e) => setCarlistDrivenWheel(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="FWD">FWD</option>
                                <option value="RWD">RWD</option>
                                <option value="AWD">AWD</option>
                                <option value="4WD">4WD</option>
                            </select>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="space-y-4">
                        <div className="pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Condition & Value</h3>
                            <p className="text-xs text-foreground/60 mt-1">Usage and valuation data</p>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Min Price (MYR)</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                disabled={fieldsDisabled}
                                value={carlistMinPrice}
                                onChange={(e) => setCarlistMinPrice(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Max Price (MYR)</label>
                            <input 
                                type="number" 
                                placeholder="9999999" 
                                disabled={fieldsDisabled}
                                value={carlistMaxPrice}
                                onChange={(e) => setCarlistMaxPrice(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div> */}

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

                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Mileage (KM)</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                disabled={fieldsDisabled}
                                value={carlistMinMileage}
                                onChange={(e) => setCarlistMinMileage(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Mileage (KM)</label>
                            <select 
                                value={mileageFrom}
                                onChange={(e) => setMileageFrom(e.target.value)}
                                disabled
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                {mileageOptions.filter(v => v !== 'Any').map(m => (
                                    <option key={m} value={m}>{Number(m).toLocaleString()}+</option>
                                ))}
                            </select>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Max Mileage (KM)</label>
                            <input 
                                type="number" 
                                placeholder="999999" 
                                disabled={fieldsDisabled}
                                value={carlistMaxMileage}
                                onChange={(e) => setCarlistMaxMileage(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div> */}

                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Sort By</label>
                            <select 
                                value={carlistSort} 
                                onChange={(e) => setCarlistSort(e.target.value)} 
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                        </div> */}
                    </div>
                </div>
                )}

                {/* Action Buttons */}
                <div className="flex pt-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                        <Button 
                            type="button"
                            href="#valuation" 
                            onClick={handleSubmit} 
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
            </form>
        </div>
    )
}