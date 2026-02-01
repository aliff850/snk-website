"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import { Button } from "../../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters, getEngineCcRangeFromLiterOption } from "../../ranges"

interface CarValuationNewProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function CarValuationNew({ onSearch, onReset, loading = false, onSearchStart }: CarValuationNewProps) {
    const [isLoading, setIsLoading] = useState(false)

    // Shared states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [region, setRegion] = useState("west")

    // Mudah state
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    // States for Unified filters
    const [fromOffset, setFromOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(50)
    const [type, setType] = useState("sell")
    const [fuelType, setFuelType] = useState("") // Unified fuel type
    const [condition, setCondition] = useState("") // Unified condition
    const [transmission, setTransmission] = useState("") // Unified transmission
    const [bodyType, setBodyType] = useState("") // Unified body type (was carType / carlistBodyType)

    // Mudah specific
    const [origin, setOrigin] = useState("")
    const [engineCapacityLiter, setEngineCapacityLiter] = useState<string>("")
    const [yearFrom, setYearFrom] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    const [priceFrom, setPriceFrom] = useState<string>("")
    const [insuredPrice, setInsuredPrice] = useState<string>("")

    // Carlist state
    const [carlistMakes, setCarlistMakes] = useState<Record<string, any>>({})
    const [carlistModels, setCarlistModels] = useState<Record<string, string | null>>({})
    const [loadingCarlistMakes, setLoadingCarlistMakes] = useState(false)

    // Carlist specific
    const [carlistVariant, setCarlistVariant] = useState("")

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
            // Fetch both models if we have a make
            fetchModels(makeSlug)
            fetchCarlistModels(makeSlug)
        }

    }, [make]) // Changed dependency to make - we want to fetch once when make is selected

    // Merging all makes
    const unifiedMakes = useMemo(() => {
        const makes = new Set<string>()
        Object.keys(availableMakes).forEach(m => makes.add(m))
        Object.keys(carlistMakes).forEach(m => makes.add(m))

        // Basically merge all available makes and models
        return Array.from(makes).sort()
    }, [availableMakes, carlistMakes])

    // Merging all Models
    const unifiedModels = useMemo(() => {
        const models = new Set<string>()
        Object.keys(availableModels).filter(k => k !== '__id__').forEach(m => models.add(m))
        Object.keys(carlistModels).forEach(m => models.add(m))
        return Array.from(models).sort()
    }, [availableModels, carlistModels])

    // resets all
    const resetAll = () => {
        setMake("")
        setModel("")
        setFromOffset(0)
        setLimit(50)
        setType("sell")
        setFuelType("")
        setCondition("")
        setOrigin("")
        setTransmission("")
        setBodyType("")
        setYearFrom("")
        setMileageFrom("")
        setPriceFrom("")
        setInsuredPrice("")
        setEngineCapacityLiter("")

        // Reset Carlist specific
        setCarlistVariant("")

        setCarlistModels({})
        setAvailableModels({})

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
                condition: 'used'
            }

            if (carlistVariant) query.variant = carlistVariant

            // Map body type
            if (bodyType) {
                // Unified body types: "sedan", "hatchback", "suv", "mpv", "coupe", "pickup", "convertible", "wagon", "van"
                const bodyTypeMap: Record<string, string> = {
                    'sedan': 'sedan',
                    'hatchback': 'Hatchback',
                    'suv': 'suv',
                    'mpv': 'MPV',
                    'coupe': 'Coupe',
                    'pickup': 'pickup',
                    'convertible': 'Convertible',
                    'wagon': 'wagon',
                    'van': 'van'
                }
                const mappedBodyType = bodyTypeMap[bodyType] || bodyType
                query.body_type = mappedBodyType
            }

            const baseFilters: Record<string, any> = {
                page_size: 50
            }

            // Map transmission
            if (transmission) {
                // Unified: "auto", "manual"
                const transMap: Record<string, string> = {
                    'auto': 'Automatic',
                    'manual': 'Manual'
                }
                baseFilters.transmission = transMap[transmission] || transmission
            }

            // Map fuel type
            if (fuelType) {
                // Unified: "petrol", "hybrid", "diesel", "electric"
                const fuelMap: Record<string, string> = {
                    'petrol': 'Petrol',
                    'diesel': 'Diesel',
                    'hybrid': 'Hybrid',
                    'electric': 'Electric'
                }
                baseFilters.fuel_type = fuelMap[fuelType] || fuelType
            }

            if (fuelType) {
                // Unified: "petrol", "hybrid", "diesel", "electric"
                const fuelMap: Record<string, string> = {
                    'petrol': 'Petrol',
                    'diesel': 'Diesel',
                    'hybrid': 'Hybrid',
                    'electric': 'Electric'
                }
                baseFilters.fuel_type = fuelMap[fuelType] || fuelType
            }

            // Use unified price/mileage
            if (priceFrom) baseFilters.price = parseInt(priceFrom, 10)
            if (mileageFrom) baseFilters.mileage = parseInt(mileageFrom, 10)

            // Fetch ascending
            const ascFilters = { ...baseFilters, sort: 'asc' }
            const ascRequestBody = {
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

            // Fetch descending
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

            // Execute both fetch requests
            const [ascResponse, descResponse] = await Promise.all([
                fetch(`/api/carlist/search`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(ascRequestBody)
                }),
                fetch(`/api/carlist/search`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(descRequestBody)
                })
            ])

            if (!ascResponse.ok) {
                const errorText = await ascResponse.text()
                throw new Error(`Failed to fetch Carlist Listings (asc): ${ascResponse.status} - ${errorText}`)
            }

            const ascListings = await ascResponse.json()
            let descListings: any[] = []

            if (descResponse.ok) {
                descListings = await descResponse.json()
            } else {
                console.warn('Failed to fetch descending Carlist listings, using ascending only')
                descListings = [...ascListings].reverse()
            }

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
            const uniqueAscending = [...allListings].sort((a: any, b: any) => {
                const priceA = a['offers.price'] || 0
                const priceB = b['offers.price'] || 0
                return priceA - priceB
            })
            const uniqueDescending = [...allListings].sort((a: any, b: any) => {
                const priceA = a['offers.price'] || 0
                const priceB = b['offers.price'] || 0
                return priceB - priceA
            })

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
                    bodyType: bodyType,
                    transmission: transmission,
                    fuelType: fuelType,
                    price: priceFrom,
                    mileage: mileageFrom,
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
                if (fuelType) searchQuery.fueltype = fuelType

                // Map body type to car_type_id if needed, or pass as is if it matches
                // Unified: "sedan", "hatchback", "suv", "mpv", "coupe", "pickup", "convertible", "wagon", "van"
                // Mudah expects: "sedan", "hatchback", "suvs", "mpvs", "coupe", "sports", "pick_up", "4_wheels", "other"
                // Some filters have been mapped as "other" as that is the closest match
                if (bodyType) {
                    const mudahBodyMap: Record<string, string> = {
                        'sedan': 'sedan',
                        'hatchback': 'hatchback',
                        'suv': 'suvs',
                        'mpv': 'mpvs',
                        'coupe': 'coupe',
                        'pickup': 'pick_up',
                        'convertible': 'sports', // Closest match
                        'wagon': 'other', // Closest match
                        'van': 'other'
                    }
                    const mapped = mudahBodyMap[bodyType]
                    if (mapped) searchQuery.car_type_id = mapped
                }

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
            // Always fetch both ascending and descending
            const [ascendingListings, descendingListings] = await Promise.all([
                fetchListings('price_asc').catch(e => {
                    console.error('Mudah Ascending Error:', e)
                    return []
                }),
                fetchListings('price_desc').catch(e => {
                    console.error('Mudah Descending Error:', e)
                    return []
                })
            ])

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
            const uniqueAscending = [...allListings].sort((a: any, b: any) => a.price - b.price)
            const uniqueDescending = [...allListings].sort((a: any, b: any) => b.price - a.price)

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
                    bodyType: bodyType,
                    engineCapacity: engineCapacityLiter,
                    fuelType: fuelType,
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

            // Fetch from all sources
            try {
                const mudahResult = await getMudahData()
                results.push(mudahResult)
            } catch (e: any) {
                errors.push(`Mudah: ${e?.message || "Unknown error"}`)
            }

            try {
                const carlistResult = await getCarlistData()
                results.push(carlistResult)
            } catch (e: any) {
                errors.push(`Carlist: ${e?.message || "Unknown error"}`)
            }

            // Construct user inputs object from state to ensure consistency
            const currentUserInputs = {
                make,
                model,
                region,
                year: yearFrom,
                bodyType,
                engineCapacity: engineCapacityLiter,
                fuelType,
                transmission,
                origin,
                condition,
                mileage: mileageFrom,
                insuredPrice,

                variant: carlistVariant,
            }

            if (results.length === 0) {
                onSearch({ error: errors.join('; ') || "No results from source" })
                return
            }

            // Combine results if multiple
            if (results.length === 1) {
                const result = results[0]
                onSearch({
                    ...result,
                    userInputs: currentUserInputs, // Ensure consistent inputs
                    counts: {
                        [result.source.toLowerCase()]: result.listings.length,
                        total: result.listings.length
                    }
                })
            } else {
                // Combine
                const combinedListings = results.flatMap(r => r.listings)

                // Helper to get price for sorting
                const getPrice = (listing: any) => {
                    // Mudah has 'price', Carlist has 'offers.price' return raw numeric
                    return listing.price || listing['offers.price'] || listing.normalizedPrice || 0
                }

                const combinedAscending = [...combinedListings].sort((a: any, b: any) => getPrice(a) - getPrice(b))
                const combinedDescending = [...combinedListings].sort((a: any, b: any) => getPrice(b) - getPrice(a))

                onSearch({
                    listings: combinedListings,
                    listingsAscending: combinedAscending,
                    listingsDescending: combinedDescending,
                    source: 'Combined',
                    vehicleType: 'car',
                    userInputs: currentUserInputs,
                    counts: {
                        mudah: results.find(r => r.source === 'Mudah')?.listings.length || 0,
                        carlist: results.find(r => r.source === 'Carlist')?.listings.length || 0,
                        total: combinedListings.length
                    }
                })
            }
        } catch (e: any) {
            onSearch({ error: e?.message || "Something went wrong" })
        } finally {
            setIsLoading(false)
        }
    }

    // const showMudah = sources.includes('mudah')
    // const showCarlist = sources.includes('carlist')

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {/* Make/Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-brand font-medium mb-1">*Make</label>
                        <select
                            value={make}
                            onChange={(e) => {
                                setMake(e.target.value)
                                // Models are fetched via effect when make changes
                                if (!e.target.value) {
                                    setAvailableModels({})
                                    setCarlistModels({})
                                }
                            }}
                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                            disabled={loadingMakes || loadingCarlistMakes}
                        >
                            <option value="">Select a make...</option>
                            {unifiedMakes.map(makeKey => (
                                <option key={makeKey} value={makeKey}>
                                    {makeKey.replace(/-/g, ' ').toUpperCase()}
                                </option>
                            ))}
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
                            disabled={!make || (unifiedModels.length === 0)}
                        >
                            <option value="">Select a model...</option>
                            {unifiedModels.map(modelKey => (
                                <option key={modelKey} value={modelKey}>
                                    {modelKey.replace(/-/g, ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {make && unifiedModels.length === 0 && !loadingMakes && !loadingCarlistMakes && (
                            <p className="mt-1 text-xs text-foreground/60">No models found for this make</p>
                        )}
                    </div>
                </div>
                {/* Option to change between East and West Malaysia */}
                <div className="flex flex-col gap-2 border-b-2 border-brand/20 pb-4">
                    <p className="text-brand font-medium">*Region</p>
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

                {/* Vehicle Listing Query */}
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
                                value={bodyType}
                                onChange={(e) => setBodyType(e.target.value)}
                                disabled={fieldsDisabled}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            >
                                <option value="">--</option>
                                <option value="sedan">Sedan</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="suv">SUV</option>
                                <option value="mpv">MPV</option>
                                <option value="coupe">Coupe</option>
                                <option value="pickup">Pick-up</option>
                                <option value="convertible">Convertible</option>
                                <option value="wagon">Wagon</option>
                                <option value="van">Van</option>
                            </select>
                        </div>

                        {/* Variant */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Variant</label>
                            </div>
                            <input
                                type="text"
                                placeholder="e.g., 1.5G"
                                disabled={fieldsDisabled}
                                value={carlistVariant}
                                onChange={(e) => setCarlistVariant(e.target.value)}
                                className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                            />
                        </div>

                        {/* Origin */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Origin</label>
                            </div>
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
                            <label className="block text-sm font-medium mb-1">*Fuel Type</label>
                            <select
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
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

                        {/* Engine Capacity */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Engine Capacity (L)</label>
                            </div>
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


                    </div>

                    {/* Condition & Value */}
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

                        {/* Insured Price - Available for both */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">Previous Insured Sum (MYR)</label>
                            </div>
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