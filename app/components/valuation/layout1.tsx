"use client"

import React, { useState, useMemo, useEffect } from "react"
import { ValuationResults } from "./ValuationResults"
import { Button } from "../ui/button"

export function ValuationLayout() {
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [variants, setVariants] = useState<string[]>([])

    const [fromOffset, setFromOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(10)
    const [sortby, setSortby] = useState("price_asc")
    const [type, setType] = useState("sell")
    const [fueltype, setFueltype] = useState("")
    const [condition, setCondition] = useState("")
    const [transmission, setTransmission] = useState("")
    const [carType, setCarType] = useState("")
    const [mfgYear, setMfgYear] = useState("")
    const [mileage, setMileage] = useState("")
    const [price, setPrice] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<any | null>(null)
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")

    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])

    // Fetch available makes on component mount
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

    // fetch models for selected make
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

    // loads all makes on mount
    useEffect(() => {
        fetchMakes()
    }, [])

    const resetAll = () => {
        setMake("")
        setModel("")
        setVariants([])
        setFromOffset(0)
        setLimit(10)
        setSortby("price_asc")
        setType("sell")
        setFueltype("")
        setCondition("")
        setTransmission("")
        setCarType("")
        setMfgYear("")
        setMileage("")
        setPrice("")
        setResults(null)
        setError(null)
    }

    const clearResults = () => {
        setResults(null)
        setError(null)
    }

    // faisal help me
    const getZigWheelsData = async (endpoint: 'about' | 'pricing' | 'specifications' | 'features') => {
        if (!canSubmit) return
        setLoading(true)
        setError(null)
        try {
            const makeSlug = slug(make)
            const modelSlug = slug(model)
            const headers = { "Content-Type": "application/json" }
    
            let response
            if (endpoint === 'about') {
                response = await fetch(`/api/information/about?make=${encodeURIComponent(makeSlug)}&model=${encodeURIComponent(modelSlug)}`)
            } else {
                // FIX: Add make and model as query params, only send variants in body
                response = await fetch(`/api/information/${endpoint}?make=${encodeURIComponent(makeSlug)}&model=${encodeURIComponent(modelSlug)}`, { 
                    method: "POST", 
                    headers, 
                    body: JSON.stringify(variants) // Send variants array directly
                })
            }
    
            if (!response.ok) {
                const errorText = await response.text()
                console.error(`ZigWheels ${endpoint} API error:`, response.status, errorText)
                throw new Error(`Failed to fetch ZigWheels ${endpoint}: ${response.status} - ${errorText}`)
            }
    
            const data = await response.json()
            setResults((prev: any) => ({ 
                ...prev, 
                [endpoint]: data, 
                make: makeSlug, 
                model: modelSlug,
                source: 'ZigWheels'
            }))
        } catch (e: any) {
            setError(e?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const getMudahData = async () => {
        if (!canSubmit) return
        setLoading(true)
        setError(null)
        try {
            const makeSlug = slug(make)
            const modelSlug = slug(model)

            const headers = { "Content-Type": "application/json" }

            // Create searchQuery object as expected by Mudah API
            const searchQuery: Record<string, any> = { 
                make_id: makeSlug, 
                model_id: modelSlug, 
                From: fromOffset, 
                limit, 
                sortby, 
                type 
            }

            // optional fields with validation
            if (mfgYear) {
                // Validate year format: YYYY-YYYY or YYYY-
                const yearPattern = /^\d{4}-(\d{4})?$/
                if (!yearPattern.test(mfgYear)) {
                    throw new Error('Year must be in format YYYY-YYYY or YYYY- (e.g. 2015-2020 or 2018-)')
                }
                searchQuery.mfg_year = mfgYear
            }
            if (fueltype) searchQuery.fueltype = fueltype
            if (condition) searchQuery.condition = condition
            if (mileage) {
                // validate mileage format: number-number
                const mileagePattern = /^\d{1,6}-(\d{1,6})?$/
                if (!mileagePattern.test(mileage)) {
                    throw new Error('Mileage must be in format number-number (e.g. 0-80000)')
                }
                searchQuery.mileage = mileage
            }
            if (carType) searchQuery.car_type_id = carType
            if (transmission) searchQuery.transmission_id = transmission
            if (price) {
                // validate price format: number-number
                const pricePattern = /^\d{1,10}-(\d{1,10})?$/
                if (!pricePattern.test(price)) {
                    throw new Error('Price must be in format number-number (e.g. 20000-90000)')
                }
                searchQuery.price = price
            }

            // Wrap in searchQuery object as expected by the API
            const mudahBody = { searchQuery }

            // Debug logging
            console.log('Mudah request body:', mudahBody)
            console.log('Search query:', searchQuery)
            console.log('hello Nicholas')

            const response = await fetch(`/api/mudah/search`, { method: "POST", headers, body: JSON.stringify(mudahBody) })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Mudah API error:', response.status, errorText)
                throw new Error(`Failed to fetch Mudah Listings: ${response.status} - ${errorText}`)
            }

            const listings = await response.json()
            setResults((prev: any) => ({ 
                ...prev, 
                listings, 
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

    return(
        <div className="w-full bg-black/50 px-4 md:px-12 lg:px-24 py-16 pt-30">
            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-6xl font-bold text-brand-element">SNK Real-Time Online Inquiry Platform</h1>
                    <h3 className="text-4xl font-bold text-brand-white">For Motor Vehicle Valuation</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Section for specifications from Zigwheels */}
                    <div className="rounded-3xl border border-gray-200 shadow-sm p-6 bg-brand-white flex flex-col gap-4">
                        <h3 className="text-2xl font-semibold text-gray-900">Vehicle Specifications</h3>

                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Make</label>
                                <input 
                                    value={make} 
                                    onChange={(e) => setMake(e.target.value)} 
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-element/60" 
                                    placeholder="e.g. byd, proton, toyota" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <input 
                                    value={model} 
                                    onChange={(e) => setModel(e.target.value)} 
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-element/60" 
                                    placeholder="e.g. dolphin, x50, vios" 
                                />
                            </div>
                            
                            <div className="flex justify-center">
                                <Button
                                    onClick={() => {
                                        getZigWheelsData('about');
                                        getZigWheelsData('pricing');
                                        getZigWheelsData('specifications');
                                        getZigWheelsData('features');
                                    }}
                                    variant="secondary"
                                    size="lg"
                                    disabled={!canSubmit || loading}
                                >
                                    Get Specifications
                                </Button>
                            </div>
                            
                            
                        </form>
                    </div>

                    {/* Section for Mudah */}
                    <div className="rounded-3xl border border-gray-200 shadow-sm p-6 bg-brand-white flex flex-col gap-4">
                        
                        <h3 className="text-2xl font-semibold">Vehicle Valuation</h3>

                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                <div>
                                    {/* Very epic make and model dropdown */}
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
                                    <label className="block text-sm font-medium">Model</label>
                                    <select 
                                        value={model} 
                                        onChange={(e) => setModel(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150"
                                        disabled={!make || Object.keys(availableModels).length === 0}
                                    >
                                        <option value="">Select a model...</option>
                                        {Object.keys(availableModels).map(modelKey => (
                                            <option key={modelKey} value={modelKey}>{modelKey.replace(/-/g, ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                    {make && Object.keys(availableModels).length === 0 && !loadingMakes && (
                                        <p className="mt-1 text-xs text-gray-500">No models found for this make</p>
                                    )}
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">Make</label>
                                    <input 
                                        value={make} 
                                        onChange={(e) => setMake(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-element/60" 
                                        placeholder="e.g. proton, toyota, honda" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Model</label>
                                    <input 
                                        value={model} 
                                        onChange={(e) => setModel(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-element/60" 
                                        placeholder="e.g. x70, vios, city" 
                                    />
                                </div> */}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* <div>
                                    <label className="block text-sm font-medium">Offset (From)</label>
                                    <input 
                                        type="number" 
                                        min={0} 
                                        value={fromOffset} 
                                        onChange={(e) => setFromOffset(Number(e.target.value))} 
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" 
                                    />
                                </div> */}
                                <div>
                                    <label className="block text-sm font-medium">Limit</label>
                                    <input 
                                        type="number" 
                                        min={1} 
                                        value={limit} 
                                        onChange={(e) => setLimit(Number(e.target.value))} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Sort By</label>
                                    <select 
                                        value={sortby} 
                                        onChange={(e) => setSortby(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2"
                                    >
                                        <option value="price_asc">Price Asc</option>
                                        <option value="price_desc">Price Desc</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Type</label>
                                    <select 
                                        value={type} 
                                        onChange={(e) => setType(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2"
                                    >
                                        <option value="sell">Sell</option>
                                        <option value="let">Let</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Fuel Type</label>
                                    <select 
                                        value={fueltype} 
                                        onChange={(e) => setFueltype(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2"
                                    >
                                        <option value="">Any</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="diesal">Diesel</option>
                                        <option value="electric">Electric</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Condition</label>
                                    <select 
                                        value={condition} 
                                        onChange={(e) => setCondition(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2"
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
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2"
                                    >
                                        <option value="">Any</option>
                                        <option value="auto">Auto</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Body Type</label>
                                    <select 
                                        value={carType} 
                                        onChange={(e) => setCarType(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2"
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Year (range)</label>
                                    <input 
                                        value={mfgYear} 
                                        onChange={(e) => setMfgYear(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2" 
                                        placeholder="e.g. 2015-2020 or 2018-" 
                                        pattern="^\d{4}-(\d{4})?$"
                                    />
                                    {/* <p className="mt-1 text-xs text-gray-500">Format: YYYY-YYYY or YYYY- (e.g. 2015-2020 or 2018-)</p> */}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Mileage (km range)</label>
                                    <input 
                                        value={mileage} 
                                        onChange={(e) => setMileage(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2" 
                                        placeholder="e.g. 0-80000" 
                                        pattern="^\d{1,6}-(\d{1,6})?$"
                                    />
                                    {/* <p className="mt-1 text-xs text-gray-500">Format: number-number (e.g. 0-80000)</p> */}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Price (MYR range)</label>
                                    <input 
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)} 
                                        className="mt-1 w-full rounded-lg border border-foreground/40 px-3 py-2" 
                                        placeholder="e.g. 20000-90000" 
                                        pattern="^\d{1,10}-(\d{1,10})?$"
                                    />
                                    {/* <p className="mt-1 text-xs text-gray-500">Format: number-number (e.g. 20000-90000)</p> */}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                    type="button" 
                                    onClick={() => {
                                        getMudahData(),
                                        clearResults()
                                    
                                    }} 
                                    disabled={!canSubmit || loading}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Get Listings
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={resetAll} 
                                    variant="secondary"
                                    size="sm"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Section for literally ALL */}

                {/* I've not done it yet */}

                {/* Section to display all results */}

                <ValuationResults 
                    results={results}
                    error={error}
                    loading={loading}
                    onClearResults={clearResults}
                />
            </div>
        </div>
    )
}