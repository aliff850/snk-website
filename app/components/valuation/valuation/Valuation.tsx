"use client"

import { HelpModal } from "./HelpModal";
import React, { useState, useMemo, useEffect } from "react"
import { ArrowRight, RotateCcw, ArrowDown, CircleQuestionMark } from 'lucide-react'
import { FaCar } from "react-icons/fa";
import { FaCarOn } from "react-icons/fa6"
import { ValuationResults } from "./ValuationResults"
import { Button } from "../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters, getEngineCcRangeFromLiterOption } from "../ranges"
// import Link from "next/link";

export function ValuationLayout() {
    // Help modal
    const [isHelpOpen, setIsHelpOpen] = useState(false)
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
    const [origin, setOrigin] = useState("")
    const [transmission, setTransmission] = useState("")
    const [carType, setCarType] = useState("")
    const [engineCapacityLiter, setEngineCapacityLiter] = useState<string>("")
    // const [mfgYear, setMfgYear] = useState("")
    // const [mileage, setMileage] = useState("")
    // const [price, setPrice] = useState("")
    // All states for dropdown ranges
    const [yearFrom, setYearFrom] = useState<string>("")
    // const [yearTo, setYearTo] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    // const [mileageTo, setMileageTo] = useState<string>("")
    const [priceFrom, setPriceFrom] = useState<string>("")
    // const [priceTo, setPriceTo] = useState<string>("")
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
        // setVariants([])
        setFromOffset(0)
        setLimit(50)
        // setSortby("price_asc")
        setType("sell")
        setFueltype("")
        setCondition("")
        setOrigin("")
        setTransmission("")
        setCarType("")
        // setMfgYear("")
        // setMileage("")
        // setPrice("")
        setYearFrom("")
        // setYearTo("")
        setMileageFrom("")
        // setMileageTo("")
        setPriceFrom("")
        // setPriceTo("")
        setInsuredPrice("")
        setResults(null)
        setError(null)
        setEngineCapacityLiter("")
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
                // Model year
                const yearQuery = (() => {
                    const from = yearFrom || ""
                    // const to = yearTo || ""
                    if (!from) return ""
                    if (from) return `${from}-${from}`
                    // if (from && !to) return `${from}-${from}`
                    return `${MIN_VALUES.year}-`
                })()

                if (yearQuery) searchQuery.mfg_year = yearQuery
                if (fueltype) searchQuery.fueltype = fueltype
                // if (condition) searchQuery.condition = condition

                // Engine capacity
                const engineCapacityCcRange = (() => {
                    if (!engineCapacityLiter) return null
                    const range = getEngineCcRangeFromLiterOption(engineCapacityLiter)
                    return range ? `${range.min}-${range.max}` : null
                })()

                // Mileage
                const mileageQuery = (() => {
                    const from = mileageFrom || ""
                    // const to = mileageTo || ""
                    if (!from) return ""
                    const fromNum = parseInt(from, 10)
                    if (Number.isNaN(fromNum)) return ""

                    // Create a 5,000 KM window
                    const maxOption = mileageOptions.filter(v => v !== 'Any').map(Number).at(-1) ?? fromNum
                    const toNum = Math.min(fromNum + 5000, maxOption)

                    // if (fromNum === toNum) return `${from}-${from}`
                    return `${from}-${toNum}`
                })()

                if (mileageQuery) searchQuery.mileage = mileageQuery
                if (carType) searchQuery.car_type_id = carType

                if (transmission) searchQuery.transmission_id = transmission
                const priceQuery = (() => {
                    const from = priceFrom || ""
                    // const to = priceTo || ""
                    if (!from) return ""
                    if (from) return `${from}-${from}`
                    // if (from && !to) return `${from}-`
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
        <div className="w-full bg-black/50 px-4 md:px-12 lg:px-24 pb-8 md:pb-16 pt-32 relative">
            {/* Help Button */}
            <button
                onClick={() => setIsHelpOpen(true)}
                className="fixed left-6 bottom-6 transform z-50 w-16 h-16 bg-brand border border-brand-element text-brand-white rounded-full shadow-lg hover:bg-brand/90 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Help"
            >
                <CircleQuestionMark className="w-8 h-8" />
                <span
                    className="
                        absolute left-[90%] 
                        whitespace-nowrap 
                        opacity-0 
                        pointer-events-none 
                        group-hover:opacity-100 
                        group-hover:pointer-events-auto 
                        transition-all 
                        duration-300 
                        translate-y-2 
                        group-hover:translate-y-0
                        bg-brand border border-brand-element text-brand-white font-medium px-3 py-1 rounded-xl shadow
                        ml-4
                        text-base
                    "
                >
                    How To Use?
                </span>
            </button>
            
            <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">

                <div id="main" className="flex flex-col items-center gap-4 md:gap-6">
                    <div className="p-8 rounded-full bg-brand-element w-32 h-32">
                        <FaCar className="w-16 h-16 text-brand-white/80"/>
                    </div>

                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-element">SNK Real-Time Online Inquiry Platform</h1>
                        <h3 className="text-2xl md:text-3xl font-bold text-brand-white">For Motor Vehicle Market Valuation</h3>
                    </div>
                </div>
                

                <div className="grid grid-cols-1 gap-8 md:gap-12">

                    <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
        
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            
                            <HelpModal 
                                isOpen={isHelpOpen} 
                                onClose={() => setIsHelpOpen(false)} 
                            />
                            
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
                                                clearResults()
                                            }} 
                                            disabled={!canSubmit || loading}
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

                    {/* Section to display all results */}
                    <div id="valuation">
                    <ValuationResults 
                        results={results}
                        error={error}
                        loading={loading}
                        onClearResults={clearResults}
                        link="#main"
                    />
                    </div>
                    
                </div>

                <div className="bg-brand-white rounded-2xl md:rounded-3xl border border-foreground/40 p-4 md:p-6">
                    <div className="md:p-6 w-full flex flex-col gap-4 justify-center items-center md:border md:border-dashed md:border-foreground/20 rounded-2xl">
                        <div className="p-4 rounded-2xl md:rounded-3xl bg-brand-element/10">
                            <FaCarOn className="w-12 h-12 text-brand"/>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-center text-brand">Get Detailed Specifications Regarding Your Vehicle</h3>

                        <Button href="/valuation/specifications" variant="secondary" size="sm" className="flex md:text-xl gap-2">
                            Go to Vehicle Specifications <ArrowRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}