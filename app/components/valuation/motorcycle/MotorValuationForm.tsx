"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { ArrowDown, RotateCcw } from 'lucide-react'
import { Button } from "../../../ui/ButtonComponent"
import { yearOptions, MIN_VALUES } from "../../ranges"
import { RegionSelection } from "../../shared/RegionSelection"
import SearchableSelect from '@/app/components/ui/SearchableSelect'
import { FormTextInput, FormSelect } from "../cars/CarValuationNew"
import { MakeModelPopup } from "../../shared/MakeModelPopup"
import { scrollToElement } from "@/app/components/ui/SmoothScroll"

interface MotorValuationFormProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function MotorValuationForm({ onSearch, onReset, loading = false, onSearchStart }: MotorValuationFormProps) {
    const { user, refreshTokens, getAccessToken } = useAuth()
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
    const [insuredPrice, setInsuredPrice] = useState<string>("")
    const [condition, setCondition] = useState("")

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])
    const fieldsDisabled = !canSubmit
    const [showPopup, setShowPopup] = useState(false)

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

    // Resets all fields
    const resetAll = () => {
        setMake("")
        setModel("")
        setFromOffset(0)
        setLimit(50)
        setType("sell")
        setYearFrom("")
        setInsuredPrice("")
        if (onReset) {
            onReset()
        }
    }

    const getMudahData = async () => {
        if (!canSubmit) {
            setShowPopup(true)
            return
        }

        // Check if user has tokens
        if (!user?.tokens_remaining || user.tokens_remaining <= 0) {
            onSearch({ error: "No valuation tokens remaining. Tokens refresh weekly." })
            return
        }

        setIsLoading(true)
        if (onSearchStart) {
            onSearchStart()
        }

        try {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                onSearch({ error: "Authentication error. Please log in again." })
                return
            }

            const makeSlug = slug(make)
            const modelSlug = slug(model)

            // Build Mudah motorcycle search params
            const mudahSearchQuery: Record<string, any> = {
                motorcycle_make_id: makeSlug,
                motorcycle_model_id: modelSlug,
                From: fromOffset,
                limit,
                sortby: 'price_asc'
            }

            const yearQuery = yearFrom ? `${yearFrom}-${yearFrom}` : ""
            if (yearQuery) mudahSearchQuery.mfg_year = yearQuery

            // Build unified request (motorcycle only uses Mudah)
            const requestBody = {
                vehicle_type: 'motorcycle',
                mudah: {
                    searchQuery: mudahSearchQuery,
                    whitelist_attributes: [
                        'model_name', 'make_name', 'condition_name', 'manufactured_year',
                        'fueltype', 'price', 'mileage', 'transmission_name',
                        'engine_capacity', 'car_type_name', 'adview_url', 'image', 'variant'
                    ]
                }
            }

            // Call unified endpoint
            const response = await fetch('/api/valuation/get_marketdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const errorMsg = errorData?.detail || `Request failed (${response.status})`
                onSearch({ error: errorMsg })
                return
            }

            const data = await response.json()

            // Refresh token count
            await refreshTokens()

            // Process Mudah results
            const mudahListings = Array.isArray(data.results?.mudah) ? data.results.mudah : []

            // Deduplicate using adview_url
            const listingsMap: Record<string, any> = {}
            mudahListings.forEach((listing: any) => {
                if (listing.adview_url) listingsMap[listing.adview_url] = listing
            })
            const allListings = Object.values(listingsMap)
            const ascending = [...allListings].sort((a: any, b: any) => a.price - b.price)
            const descending = [...allListings].sort((a: any, b: any) => b.price - a.price)

            const results = {
                listings: ascending,
                listingsAscending: ascending,
                listingsDescending: descending,
                make: makeSlug,
                model: modelSlug,
                vehicleType: 'motorcycle',
                source: 'Mudah',
                userInputs: {
                    make, model, region,
                    year: yearFrom, condition, insuredPrice
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
            <form id="motorcycle-form" className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="motorcycle-form" className="sr-only">Motorcycle Valuation Form</label>
                {/* Region options */}
                <div className="col-span-2">
                    <RegionSelection
                        value={region}
                        onChange={setRegion}
                    />
                </div>

                {/* Make model and region */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="col-span-2 flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                        <h3 className="text-lg font-bold text-brand">Motorcycle Make/Model</h3>
                        <p className="text-xs text-foreground">Select the make and model of the vehicle</p>
                    </div>

                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
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
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {/* Vehicle identity */}
                    <div className="flex flex-col gap-4">
                        <div className="pb-3 border-b-2 border-brand/20 flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs">Basic vehicle information</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">*Year</label>
                            <FormSelect
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                disabled={fieldsDisabled}
                                options={yearOptions}
                            />
                        </div>
                    </div>

                    {/* Search filters */}
                    <div className="flex flex-col gap-4">
                        <div className="pb-3 border-b-2 border-brand/20 flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-brand">Condition & Value</h3>
                            <p className="text-xs">Usage and valuation data</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">*Condition</label>
                            <FormSelect
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "Very Poor", label: "Very Poor" },
                                    { value: "Poor", label: "Poor" },
                                    { value: "Fair", label: "Fair" },
                                    { value: "Good", label: "Good" },
                                    { value: "Very Good", label: "Very Good" }
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Previous Insured Sum (MYR)</label>
                            <FormTextInput
                                type="number"
                                max={9999999}
                                placeholder="E.g. 123456"
                                disabled={fieldsDisabled}
                                value={insuredPrice}
                                onChange={(e) => setInsuredPrice(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                        <Button
                            type="button"
                            href="#valuation"
                            onClick={() => {
                                getMudahData()
                                if (canSubmit) {
                                    setTimeout(() => scrollToElement("valuation"), 100)
                                }
                            }}
                            disabled={loading || isLoading}
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
            <MakeModelPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        </div>
    )
}

