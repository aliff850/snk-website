"use client"

import React, { useState, useMemo, useEffect } from "react"
import { ArrowRight, RotateCcw, ArrowDown } from 'lucide-react'
import { FaCar } from "react-icons/fa";
import { FaCarOn } from "react-icons/fa6"
import { ValuationResults } from "./ValuationResults"
import { Button } from "../ui/button"
import { yearOptions, mileageOptions, priceOptions, MIN_VALUES } from "./ranges"

export function ValuationLayout() {
    // Existing states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    // const [variants, setVariants] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<any | null>(null)

    // Mudah state
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    // States for Mudah filters
    const [fromOffset, setFromOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(50)
    // const [sortby, setSortby] = useState("price_asc")
    const [viewMode, setViewMode] = useState<'ascending' | 'descending'>('ascending')
    const [type, setType] = useState("sell")
    const [fueltype, setFueltype] = useState("")
    const [condition, setCondition] = useState("")
    const [transmission, setTransmission] = useState("")
    const [carType, setCarType] = useState("")
    // const [mfgYear, setMfgYear] = useState("")
    // const [mileage, setMileage] = useState("")
    // const [price, setPrice] = useState("")
    // All states for dropdown ranges
    const [yearFrom, setYearFrom] = useState<string>("")
    const [yearTo, setYearTo] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    const [mileageTo, setMileageTo] = useState<string>("")
    const [priceFrom, setPriceFrom] = useState<string>("")
    const [priceTo, setPriceTo] = useState<string>("")

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])

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
        // setVariants([])
        setFromOffset(0)
        setLimit(50)
        // setSortby("price_asc")
        setType("sell")
        setFueltype("")
        setCondition("")
        setTransmission("")
        setCarType("")
        // setMfgYear("")
        // setMileage("")
        // setPrice("")
        setYearFrom("")
        setYearTo("")
        setMileageFrom("")
        setMileageTo("")
        setPriceFrom("")
        setPriceTo("")
        setResults(null)
        setError(null)
    }

    const clearResults = () => {
        setResults(null)
        setError(null)
    }

    const getMudahData = async () => {
        if (!canSubmit) return
        setLoading(true)
        setError(null)
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
                const yearQuery = (() => {
                    const from = yearFrom || ""
                    const to = yearTo || ""
                    if (!from && !to) return ""
                    if (from && to) return `${from}-${to}`
                    if (from && !to) return `${from}-`
                    return `${MIN_VALUES.year}-${to}`
                })()
                if (yearQuery) searchQuery.mfg_year = yearQuery
                if (fueltype) searchQuery.fueltype = fueltype
                if (condition) searchQuery.condition = condition
                const mileageQuery = (() => {
                    const from = mileageFrom || ""
                    const to = mileageTo || ""
                    if (!from && !to) return ""
                    if (from && to) return `${from}-${to}`
                    if (from && !to) return `${from}-`
                    return `${MIN_VALUES.mileage}-${to}`
                })()
                if (mileageQuery) searchQuery.mileage = mileageQuery
                if (carType) searchQuery.car_type_id = carType
                if (transmission) searchQuery.transmission_id = transmission
                const priceQuery = (() => {
                    const from = priceFrom || ""
                    const to = priceTo || ""
                    if (!from && !to) return ""
                    if (from && to) return `${from}-${to}`
                    if (from && !to) return `${from}-`
                    return `${MIN_VALUES.price}-${to}`
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
                uniqueDescending = [] // less than 50 listings, keep descending empty
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

            setResults((prev: any) => ({ 
                ...prev, 
                listings: uniqueAscending,
                listingsAscending: uniqueAscending,
                listingsDescending: uniqueDescending,
                make: makeSlug, 
                model: modelSlug,
                source: 'Mudah'
            }))
        } catch (e: any) {
            setError(e?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    // const getMudahData = async () => {
    //     if (!canSubmit) return
    //     setLoading(true)
    //     setError(null)
    //     try {
    //         const makeSlug = slug(make)
    //         const modelSlug = slug(model)

    //         const headers = { "Content-Type": "application/json" }

    //         // Create searchQuery object as expected by Mudah API
    //         const searchQuery: Record<string, any> = { 
    //             make_id: makeSlug, 
    //             model_id: modelSlug, 
    //             From: fromOffset, 
    //             limit, 
    //             // sortby, 
    //             type 
    //         }

    //         // optional fields with validation
    //         if (mfgYear) {
    //             // Validate year format: YYYY-YYYY or YYYY-
    //             const yearPattern = /^\d{4}-(\d{4})?$/
    //             if (!yearPattern.test(mfgYear)) {
    //                 throw new Error('Year must be in format YYYY-YYYY or YYYY- (e.g. 2015-2020 or 2018-)')
    //             }
    //             searchQuery.mfg_year = mfgYear
    //         }
    //         if (fueltype) searchQuery.fueltype = fueltype
    //         if (condition) searchQuery.condition = condition
    //         if (mileage) {
    //             // validate mileage format: number-number
    //             const mileagePattern = /^\d{1,6}-(\d{1,6})?$/
    //             if (!mileagePattern.test(mileage)) {
    //                 throw new Error('Mileage must be in format number-number (e.g. 0-80000)')
    //             }
    //             searchQuery.mileage = mileage
    //         }
    //         if (carType) searchQuery.car_type_id = carType
    //         if (transmission) searchQuery.transmission_id = transmission
    //         if (price) {
    //             // validate price format: number-number
    //             const pricePattern = /^\d{1,10}-(\d{1,10})?$/
    //             if (!pricePattern.test(price)) {
    //                 throw new Error('Price must be in format number-number (e.g. 20000-90000)')
    //             }
    //             searchQuery.price = price
    //         }

    //         // Wrap in searchQuery object as expected by the API
    //         const mudahBody = { searchQuery }

    //         // Debug logging
    //         console.log('Mudah request body:', mudahBody)
    //         console.log('Search query:', searchQuery)
    //         console.log('hello Nicholas')

    //         const response = await fetch(`/api/mudah/search`, { method: "POST", headers, body: JSON.stringify(mudahBody) })

    //         if (!response.ok) {
    //             const errorText = await response.text()
    //             console.error('Mudah API error:', response.status, errorText)
    //             throw new Error(`Failed to fetch Mudah Listings: ${response.status} - ${errorText}`)
    //         }

    //         const listings = await response.json()
    //         setResults((prev: any) => ({ 
    //             ...prev, 
    //             listings, 
    //             make: makeSlug, 
    //             model: modelSlug,
    //             source: 'Mudah'
    //         }))
    //     } catch (e: any) {
    //         setError(e?.message || "Something went wrong")
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    return(
        <div className="w-full bg-black/50 px-4 md:px-12 lg:px-24 py-16 pt-30">
            <div className="max-w-6xl mx-auto flex flex-col gap-12">

                <div className="flex flex-col items-center gap-4 md:gap-6">
                    <div className="p-8 rounded-full bg-brand-element w-32 h-32">
                        <FaCar className="w-16 h-16 text-brand-white/80"/>
                    </div>

                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-brand-element">SNK Real-Time Online Inquiry Platform</h1>
                        <h3 className="text-2xl md:text-4xl font-bold text-brand-white">For Motor Vehicle Market Valuation</h3>
                    </div>
                </div>
                

                <div className="grid grid-cols-1 gap-12">

                    {/* Vehicle valuation section */}
                    <div className="rounded-3xl border border-foreground/40 shadow-sm p-6 bg-brand-white">
                        
                        {/* <div>
                            <h3 className="text-2xl font-semibold">Vehicle Valuation</h3>
                            <p className="text-sm text-foreground/50">For retrieving vehicle market value</p>
                        </div> */}
                        
                        <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                
                                <div>
                                    {/* Very epic make dropdown */}
                                    <label className="block text-sm font-medium">Make</label>
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
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        disabled={loadingMakes}
                                    >
                                        <option value="">Select a make...</option>
                                        {Object.keys(availableMakes).map(makeKey => (
                                            <option key={makeKey} value={makeKey}>{makeKey.replace(/-/g, ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                    {loadingMakes && <p className="mt-1 text-xs">Loading makes...</p>}
                                </div>

                                <div>
                                    {/* Very epic model dropdown */}
                                    <label className="block text-sm font-medium">Model</label>
                                    <select 
                                        value={model} 
                                        onChange={(e) => setModel(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
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
                                        <p className="mt-1 text-xs text-gray-500">No models found for this make</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Body Type</label>
                                    <select 
                                        value={carType} 
                                        onChange={(e) => setCarType(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="">Any</option>
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
                            {/* <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium">Limit</label>
                                    <input 
                                        type="number" 
                                        min={1} 
                                        value={limit} 
                                        onChange={(e) => setLimit(Number(e.target.value))} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150" 
                                    />
                                </div>
                            </div> */}
                            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
                                {/* <div>
                                    <label className="block text-sm font-medium">Sort By</label>
                                    <select 
                                        value={sortby} 
                                        onChange={(e) => setSortby(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="price_asc">Price Asc</option>
                                        <option value="price_desc">Price Desc</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div> */}
                                {/* <div>
                                    <label className="block text-sm font-medium">Type</label>
                                    <select 
                                        value={type} 
                                        onChange={(e) => setType(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="sell">Sell</option>
                                        <option value="let">Let</option>
                                    </select>
                                </div> */}
                                {/* <div>
                                    <label className="block text-sm font-medium">Fuel Type</label>
                                    <select 
                                        value={fueltype} 
                                        onChange={(e) => setFueltype(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="">Any</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="diesal">Diesel</option>
                                        <option value="electric">Electric</option>
                                    </select>
                                </div> */}
                            {/* </div> */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Fuel Type</label>
                                    <select 
                                        value={fueltype} 
                                        onChange={(e) => setFueltype(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="">Any</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="diesal">Diesel</option>
                                        <option value="electric">Electric</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Condition</label>
                                    <select 
                                        value={condition} 
                                        onChange={(e) => setCondition(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="">Any</option>
                                        <option value="used">Used</option>
                                        <option value="new">New</option>
                                        <option value="recon">Recon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Transmission</label>
                                    <select 
                                        value={transmission} 
                                        onChange={(e) => setTransmission(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                    >
                                        <option value="">Any</option>
                                        <option value="auto">Auto</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                                
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Year</label>
                                    <div className="mt-1 grid grid-cols-2 gap-2">
                                        <select 
                                            value={yearFrom}
                                            onChange={(e) => setYearFrom(e.target.value)}
                                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        >
                                            <option value="">From (Any)</option>
                                            {yearOptions.filter(v => v !== 'Any').map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                        <select 
                                            value={yearTo}
                                            onChange={(e) => setYearTo(e.target.value)}
                                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        >
                                            <option value="">To (Any)</option>
                                            {yearOptions.filter(v => v !== 'Any').map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Mileage (km)</label>
                                    <div className="mt-1 grid grid-cols-2 gap-2">
                                        <select 
                                            value={mileageFrom}
                                            onChange={(e) => setMileageFrom(e.target.value)}
                                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        >
                                            <option value="">From (Any)</option>
                                            {mileageOptions.filter(v => v !== 'Any').map(m => (
                                                <option key={m} value={m}>{Number(m).toLocaleString()}</option>
                                            ))}
                                        </select>
                                        <select 
                                            value={mileageTo}
                                            onChange={(e) => setMileageTo(e.target.value)}
                                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        >
                                            <option value="">To (Any)</option>
                                            {mileageOptions.filter(v => v !== 'Any').map(m => (
                                                <option key={m} value={m}>{Number(m).toLocaleString()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Price (MYR)</label>
                                    <div className="mt-1 grid grid-cols-2 gap-2">
                                        <select 
                                            value={priceFrom}
                                            onChange={(e) => setPriceFrom(e.target.value)}
                                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        >
                                            <option value="">From (Any)</option>
                                            {priceOptions.filter(v => v !== 'Any').map(p => (
                                                <option key={p} value={p}>{Number(p).toLocaleString()}</option>
                                            ))}
                                        </select>
                                        <select 
                                            value={priceTo}
                                            onChange={(e) => setPriceTo(e.target.value)}
                                            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        >
                                            <option value="">To (Any)</option>
                                            {priceOptions.filter(v => v !== 'Any').map(p => (
                                                <option key={p} value={p}>{Number(p).toLocaleString()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                    type="button" 
                                    onClick={() => {
                                        getMudahData()
                                        clearResults()
                                    }} 
                                    disabled={!canSubmit || loading}
                                    variant="secondary"
                                    size="sm"
                                    className="text-xl flex gap-2"
                                >
                                    Get Market Value
                                    <ArrowDown className="h-5 w-5" />
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={resetAll} 
                                    variant="secondary"
                                    size="sm"
                                    className="text-xl flex items-center gap-2"
                                >
                                    Reset
                                    <RotateCcw className="h-5 w-5" />
                                </Button>
                            </div>

                        </form>

                    </div>

                    {/* Section to display all results */}

                    <ValuationResults 
                        results={results}
                        error={error}
                        loading={loading}
                        onClearResults={clearResults}
                    />

                </div>

                

                <div className="bg-brand-white rounded-3xl border border-foreground/40 p-6">
                    <div className="p-6 w-full flex flex-col gap-4 justify-center items-center border border-dashed border-foreground/20 rounded-2xl">
                        <div className="p-4 rounded-3xl bg-brand-element/10">
                            <FaCarOn className="w-16 h-16 text-brand"/>
                        </div>
                        
                        <h3 className="text-3xl font-bold text-brand">Get Detailed Specifications Regarding Your Vehicle</h3>

                        <Button href="/valuation/specifications" variant="secondary" size="sm" className="flex text-xl gap-2">
                            Go to Vehicle Specifications <ArrowRight />
                        </Button>
                    </div>
                    
                
                </div>

            </div>

        </div>
    )
}