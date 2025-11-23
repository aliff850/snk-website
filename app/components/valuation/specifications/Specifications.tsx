"use client"

import React, { useState, useMemo, useEffect } from "react"
import { ArrowRight, RefreshCcw, ArrowDown } from 'lucide-react'
import { Button } from "../../ui/button"
import { SpecResults } from "./SpecResults"

export function CarSpecifications() {

    // states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [variants, setVariants] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<any | null>(null)

    // ZigWheels states
    const [zigwheelsMap, setZigwheelsMap] = useState<Record<string, any>>({})
    const [zigwheelsModels, setZigwheelsModels] = useState<string[]>([])
    const [zigwheelsVariants, setZigwheelsVariants] = useState<string[]>([])
    const [loadingZigwheels, setLoadingZigwheels] = useState(false)

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])

    // Fetch ZigWheels map on mount
    useEffect(() => {
        const fetchZigwheelsMap = async () => {
            setLoadingZigwheels(true)
            try {
                const response = await fetch('/api/information/all_vehicles')
                if (response.ok) {
                    const data = await response.json()
                    // Transform the map data
                    const transformedMap = transformMapData(data)
                    setZigwheelsMap(transformedMap)
                    // setZigwheelsMap(data)
                }
            } catch (e) {
                console.error('Failed to fetch ZigWheels vehicle map:', e)
            } finally {
                setLoadingZigwheels(false)
            }
        }
        
        // fetchMakes() // Mudah fetch
        fetchZigwheelsMap() // ZigWheels fetch
    }, [])

    // Transformation function
    const transformMapData = (originalMap: Record<string, any>) => {
        const transformed: Record<string, Record<string, any>> = {}
        
        Object.keys(originalMap).forEach(makeSlug => {
            const makeDisplay = makeSlug
            transformed[makeDisplay] = {}
            
            Object.keys(originalMap[makeSlug]).forEach(modelSlug => {
                // removing make name from model slug
                const modelDisplay = modelSlug.replace(`${makeSlug}-`, '')
                transformed[makeDisplay][modelDisplay] = originalMap[makeSlug][modelSlug]
            })
        })
        
        return transformed
    }

    // Update ZigWheels models when make changes
    useEffect(() => {
        if (make && zigwheelsMap[make]) {
            const models = Object.keys(zigwheelsMap[make])
            setZigwheelsModels(models)
        } else {
            setZigwheelsModels([])
        }
    }, [make, zigwheelsMap])

    // Update ZigWheels variants when model changes
    useEffect(() => {
        if (make && model && zigwheelsMap[make]?.[model]) {
            const variantsList = zigwheelsMap[make][model]
            setZigwheelsVariants(variantsList)
        } else {
            setZigwheelsVariants([])
        }
    }, [model, make, zigwheelsMap])

    // Handle variant selection
    const handleVariantToggle = (variant: string) => {
        setVariants(prev => 
            prev.includes(variant) 
                ? prev.filter(v => v !== variant)
                : [...prev, variant]
        )
    }

    // Get available makes from ZigWheels
    const zigwheelsMakes = Object.keys(zigwheelsMap)

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
                response = await fetch(`/api/information/${endpoint}?make=${encodeURIComponent(makeSlug)}&model=${encodeURIComponent(modelSlug)}`, { 
                    method: "POST", 
                    headers, 
                    body: JSON.stringify(variants)
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

    const clearResults = () => {
        setResults(null)
        setError(null)
    }

    const resetAll = () => {
        setMake("")
        setModel("")
        setVariants([])
        // setFromOffset(0)
        // setLimit(10)
        // setSortby("price_asc")
        // setType("sell")
        // setFueltype("")
        // setCondition("")
        // setTransmission("")
        // setCarType("")
        // setMfgYear("")
        // setMileage("")
        // setPrice("")
        setResults(null)
        setError(null)
    }

    return(

        <div className="w-full bg-black/50 px-4 md:px-12 lg:px-24 py-16 pt-30">
            <div className="max-w-6xl mx-auto">

                <div className="mb-8 flex flex-col gap-2 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-element">SNK Real-Time Online Inquiry Platform</h1>
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-white">Vehicle Specification</h3>
                </div>

                <div className="grid grid-cols-1 gap-8">

                    <div className="rounded-3xl border border-gray-200 shadow-sm p-4 md:p-6 bg-brand-white flex flex-col gap-4">
                        {/* <div>
                            <h3 className="text-2xl font-semibold text-foreground">Vehicle Specifications</h3>
                            <p className="text-sm text-foreground/50">Select vehicle to retrieve specifications</p>
                        </div> */}

                        <div className="flex justify-end">
                            <Button href="/valuation" variant="secondary" size="sm" className="flex gap-2 text-xl">
                                Return to Vehicle Valuation <ArrowRight />
                            </Button>
                        </div>

                        <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                            {/* Make Dropdown */}
                            <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Make</label>
                                <select 
                                    value={make} 
                                    onChange={(e) => setMake(e.target.value)}
                                    disabled={loadingZigwheels}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 bg-white disabled:bg-gray-100"
                                >
                                    <option value="">{loadingZigwheels ? 'Loading...' : 'Select a make'}</option>
                                    {zigwheelsMakes.sort().map((makeName) => (
                                        <option key={makeName} value={makeName}>  {/* Store the original slug */}
                                            {makeName.split('-').map(word => 
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Model Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Model</label>
                                <select 
                                    value={model} 
                                    onChange={(e) => setModel(e.target.value)}
                                    disabled={!make || zigwheelsModels.length === 0}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {!make ? 'Select make first' : 'Select a model'}
                                    </option>
                                    {zigwheelsModels.sort().map((modelName) => (
                                        <option key={modelName} value={modelName}>  {/* Store the original slug */}
                                            {modelName.split('-').map(word => 
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Variants Multi-Select */}
                            {zigwheelsVariants.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Variants (Optional - Select specific variants or leave empty for all)
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-white">
                                        {zigwheelsVariants.map((variant) => (
                                            <label key={variant} className="flex items-center gap-2 py-1.5 hover:bg-gray-50 px-2 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={variants.includes(variant)}
                                                    onChange={() => handleVariantToggle(variant)}
                                                    className="rounded border-gray-300 text-brand focus:ring-brand"
                                                />
                                                <span className="text-sm text-foreground">
                                                    {variant.split('-').map(word => 
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                    ).join(' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {variants.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {variants.length} variant{variants.length !== 1 ? 's' : ''} selected
                                        </p>
                                    )}
                                </div>
                            )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">                              
                                
                                <Button
                                    onClick={() => {
                                        getZigWheelsData('about')
                                        getZigWheelsData('pricing')
                                        getZigWheelsData('specifications')
                                        getZigWheelsData('features')
                                        clearResults()
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    disabled={!make || !model || loading}
                                    className="text-xl flex gap-2 items-center"
                                >
                                    Get Specifications
                                    <ArrowDown />
                                </Button>

                                <Button 
                                    type="button" 
                                    onClick={resetAll} 
                                    variant="secondary"
                                    size="sm"
                                    className="text-xl flex gap-2 items-center"
                                >
                                    Reset
                                    <RefreshCcw />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Section to display specification results */}
                    <SpecResults 
                        results={results}
                        error={error}
                        loading={loading}
                        onClearResults={clearResults}
                    />

                </div>

                
            </div>
        </div>
    )
}