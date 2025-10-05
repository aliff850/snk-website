"use client"

import React, { useState, useMemo, useEffect } from "react"

export function ValuationLayoutAlt() {

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

    // Fetch models for selected make
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

    // Load makes on mount
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

    const getValuation = async () => {
        if (!canSubmit) return
        setLoading(true)
        setError(null)
        try {
            const makeSlug = slug(make)
            const modelSlug = slug(model)

            // Find the correct make and model IDs from available data
            const makeData = availableMakes[makeSlug]
            if (!makeData) {
                throw new Error(`Make "${make}" not found. Available makes: ${Object.keys(availableMakes).join(', ')}`)
            }

            const modelData = availableModels[modelSlug]
            if (!modelData) {
                throw new Error(`Model "${model}" not found for make "${make}". Available models: ${Object.keys(availableModels).join(', ')}`)
            }

            const headers = { "Content-Type": "application/json" }

            const aboutReq = fetch(`/api/information/about?make=${encodeURIComponent(makeSlug)}&model=${encodeURIComponent(modelSlug)}`)
            const pricingReq = fetch(`/api/information/pricing`, { method: "POST", headers, body: JSON.stringify({ make: makeSlug, model: modelSlug, variants }) })
            const specsReq = fetch(`/api/information/specifications`, { method: "POST", headers, body: JSON.stringify({ make: makeSlug, model: modelSlug, variants }) })
            const featuresReq = fetch(`/api/information/features`, { method: "POST", headers, body: JSON.stringify({ make: makeSlug, model: modelSlug, variants }) })

            // Use the proper make_id and model_id format expected by Mudah API
            const mudahBody: Record<string, any> = { 
                make_id: `${makeData.__id__},${make}`, 
                model_id: `${modelData},${model}`, 
                From: fromOffset, 
                limit, 
                sortby, 
                type 
            }
            if (mfgYear) mudahBody.mfg_year = mfgYear
            if (fueltype) mudahBody.fueltype = fueltype
            if (condition) mudahBody.condition = condition
            if (mileage) mudahBody.mileage = mileage
            if (carType) mudahBody.car_type_id = carType
            if (transmission) mudahBody.transmission_id = transmission
            if (price) mudahBody.price = price

            const mudahReq = fetch(`/api/mudah/search`, { method: "POST", headers, body: JSON.stringify(mudahBody) })

            const [aboutRes, pricingRes, specsRes, featuresRes, mudahRes] = await Promise.all([aboutReq, pricingReq, specsReq, featuresReq, mudahReq])

            if (!aboutRes.ok) throw new Error("Failed to fetch ZigWheels About")
            if (!pricingRes.ok) throw new Error("Failed to fetch ZigWheels Pricing")
            if (!specsRes.ok) throw new Error("Failed to fetch ZigWheels Specifications")
            if (!featuresRes.ok) throw new Error("Failed to fetch ZigWheels Features")
            if (!mudahRes.ok) throw new Error("Failed to fetch Mudah Listings")

            const about = await aboutRes.json()
            const pricing = await pricingRes.json()
            const specifications = await specsRes.json()
            const features = await featuresRes.json()
            const listings = await mudahRes.json()

            setResults({ about, pricing, specifications, features, listings, make: makeSlug, model: modelSlug })
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

                    <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-white">

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Make</label>
                                <select 
                                    value={make} 
                                    onChange={(e) => {
                                        setMake(e.target.value)
                                        if (e.target.value) {
                                            fetchModels(slug(e.target.value))
                                        } else {
                                            setAvailableModels({})
                                        }
                                        setModel("") // Reset model when make changes
                                    }} 
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-element/60"
                                    disabled={loadingMakes}
                                >
                                    <option value="">Select a make...</option>
                                    {Object.keys(availableMakes).map(makeKey => (
                                        <option key={makeKey} value={makeKey}>{makeKey.replace(/-/g, ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                                {loadingMakes && <p className="mt-1 text-xs text-gray-500">Loading makes...</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <select 
                                    value={model} 
                                    onChange={(e) => setModel(e.target.value)} 
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-element/60"
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
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Variants (optional)</label>
                            <select multiple value={variants} onChange={(e) => setVariants(Array.from(e.target.selectedOptions).map(o => o.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-brand-element/60">
                                <option value="Standard Range">Standard Range</option>
                                <option value="Premium">Premium</option>
                                <option value="Executive">Executive</option>
                                <option value="Flagship">Flagship</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">ZigWheels: optional; used for Pricing/Specs/Features filtering.</p>
                        </div> */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">General Listing Filters</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Offset (From)</label>
                                        <input type="number" min={0} value={fromOffset} onChange={(e) => setFromOffset(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Limit</label>
                                        <input type="number" min={1} value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
                            </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sort By</label>
                                        <select value={sortby} onChange={(e) => setSortby(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                                        <option value="price_asc">Price Asc</option>
                                        <option value="price_desc">Price Desc</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                                        <option value="sell">Sell</option>
                                        <option value="let">Let</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Vehicle Attributes</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                                        <select value={fueltype} onChange={(e) => setFueltype(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                                        <option value="">Any</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="diesal">Diesel</option>
                                        <option value="electric">Electric</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                                        <select value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                                        <option value="">Any</option>
                                        <option value="used">Used</option>
                                        <option value="new">New</option>
                                        <option value="recon">Recon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Transmission</label>
                                        <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
                                        <option value="">Any</option>
                                        <option value="auto">Auto</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Body Type</label>
                                        <select value={carType} onChange={(e) => setCarType(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
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
                                <div>
                                        <label className="block text-sm font-medium text-gray-700">Year (range)</label>
                                        <input value={mfgYear} onChange={(e) => setMfgYear(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="e.g. 2015-2020 or 2018-" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mileage (km range)</label>
                                        <input value={mileage} onChange={(e) => setMileage(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="e.g. 0-80000" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (MYR range)</label>
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="e.g. 20000-90000" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <button type="button" onClick={getValuation} disabled={!canSubmit || loading} className={`rounded-lg px-5 py-2 font-medium text-white ${(!canSubmit || loading) ? 'bg-brand-element/60 cursor-not-allowed' : 'bg-brand-element hover:opacity-90'}`}>
                                {loading ? 'Fetching Valuation…' : 'Get Valuation'}
                            </button>
                            <button type="button" onClick={clearResults} className="rounded-lg bg-gray-100 text-gray-900 px-4 py-2 font-medium hover:bg-gray-200">Clear Results</button>
                            <button type="button" onClick={resetAll} className="rounded-lg bg-gray-900 text-white px-4 py-2 font-medium hover:bg-gray-800">New Valuation</button>
                            </div>
                        </form>
                </div>

                <div className="mt-10">
                    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900">Valuation Results</h4>
                            <div className="flex gap-3">
                                <button onClick={clearResults} className="rounded-lg bg-gray-100 text-gray-900 px-3 py-2 text-sm font-medium hover:bg-gray-200">Clear</button>
                                <button onClick={resetAll} className="rounded-lg bg-brand-element text-white px-3 py-2 text-sm font-medium hover:opacity-90">New Valuation</button>
                            </div>
                        </div>
                        <div className="p-6">
                            {error && (
                                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
                            )}
                            {!results && !loading && (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                                    <p className="text-sm">Your pricing, specifications, features, and listings will appear here.</p>
                                </div>
                            )}
                            {results && (
                                <div className="space-y-8">
                                    <div>
                                        <h5 className="text-base font-semibold text-gray-900">{results.make?.toUpperCase()} {results.model?.toUpperCase()}</h5>
                                        {results.about?.price_range && (
                                            <p className="text-sm text-gray-700">Price when new: <span className="font-medium">{results.about.price_range}</span></p>
                                        )}
                                        {results.about?.description && (
                                            <p className="mt-1 text-sm text-gray-600">{results.about.description}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <h6 className="font-semibold text-gray-900 mb-2">ZigWheels Pricing</h6>
                                            <div className="overflow-auto">
                                                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(results.pricing, null, 2)}</pre>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <h6 className="font-semibold text-gray-900 mb-2">ZigWheels Specifications</h6>
                                            <div className="overflow-auto">
                                                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(results.specifications, null, 2)}</pre>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h6 className="font-semibold text-gray-900 mb-2">ZigWheels Features</h6>
                                        <div className="overflow-auto">
                                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(results.features, null, 2)}</pre>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h6 className="font-semibold text-gray-900 mb-2">Mudah Listings</h6>
                                        <div className="overflow-auto">
                                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(results.listings, null, 2)}</pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}