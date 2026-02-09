"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import SearchableSelect from '@/app/components/ui/SearchableSelect'
import { Button } from "../../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters, getEngineCcRangeFromLiterOption } from "../../ranges"

interface CommercialValuationProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function CommercialValuation({ onSearch, onReset, loading, onSearchStart }: CommercialValuationProps) {

    // All of these are placeholders, we will replace them with the actual data from the API
    const [isLoading, setIsLoading] = useState(false)

    // Shared states
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [region, setRegion] = useState("west")
    const [weightClass, setWeightClass] = useState("")

    // Mudah state
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)

    // States for all filters (both mudah and carlist)
    // Any that is unified are stated below
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
    const [bdm, setBdm] = useState<string>("")
    const [btm, setBtm] = useState<string>("")
    const [seatCapacity, setSeatCapacity] = useState<string>("")
    const [drivenWheel, setDrivenWheel] = useState<string>("")

    // Carlist state
    const [carlistMakes, setCarlistMakes] = useState<Record<string, any>>({})
    const [carlistModels, setCarlistModels] = useState<Record<string, string | null>>({})
    const [loadingCarlistMakes, setLoadingCarlistMakes] = useState(false)

    // Carlist specific
    const [carlistVariant, setCarlistVariant] = useState("")

    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")
    const canSubmit = useMemo(() => make.trim() && model.trim() && weightClass, [make, model, weightClass])
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

    // Function which merges all makes from both sources (carlist and mudah)
    const unifiedMakes = useMemo(() => {
        const makes = new Set<string>()
        // For each make in availableMakes (mudah), add it to the set
        Object.keys(availableMakes).forEach(m => makes.add(m))
        // For each make in carlistMakes (carlist), add it to the set
        Object.keys(carlistMakes).forEach(m => makes.add(m))

        // Basically merge all available makes and models
        return Array.from(makes).sort()
        // Any make that is in both sources will only appear once
    }, [availableMakes, carlistMakes])

    // Function which merges all models from both sources (carlist and mudah)
    const unifiedModels = useMemo(() => {
        const models = new Set<string>()
        // For each model in availableModels (mudah), add it to the set
        Object.keys(availableModels).filter(k => k !== '__id__').forEach(m => models.add(m))
        // For each model in carlistModels (carlist), add it to the set
        Object.keys(carlistModels).forEach(m => models.add(m))
        return Array.from(models).sort()
        // Any model that is in both sources will only appear once
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
        setBdm("")
        setBtm("")
        setSeatCapacity("")
        setSeatCapacity("")
        setDrivenWheel("")
        setWeightClass("")

        // Reset Carlist specific
        setCarlistVariant("")

        setCarlistModels({})
        setAvailableModels({})

        if (onReset) {
            onReset()
        }
    }

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>

                {/* Commercial vehicle weight class selection */}
                {/* Radio buttons to select between below 10 ton and above 10 ton commercial vehicles */}
                {/* Placeholders for now */}
                <div className="flex flex-col gap-2 pb-3 border-b-2 border-brand/20">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-brand">Vehicle Weight Class</h3>
                        <p className="text-xs">Select the weight class of the vehicle</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="below10ton"
                                name="weightClass"
                                value="below10ton"
                                checked={weightClass === 'below10ton'}
                                onChange={(e) => setWeightClass(e.target.value)}
                                className="w-4 h-4 accent-brand"
                            />
                            <label htmlFor="below10ton" className="">Below 10 Ton</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="above10ton"
                                name="weightClass"
                                value="above10ton"
                                checked={weightClass === 'above10ton'}
                                onChange={(e) => setWeightClass(e.target.value)}
                                className="w-4 h-4 accent-brand"
                            />
                            <label htmlFor="above10ton" className="">Above 10 Ton</label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                    <h3 className="text-lg font-bold text-brand">Vehicle Make/Model</h3>
                    <p className="text-xs text-foreground">Select the make and model of the vehicle and also the region</p>
                </div>

                {/* Make/Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-brand">*Make</label>
                        <SearchableSelect
                            options={Object.keys(availableMakes).map((make) => ({
                                value: make,
                                label: make,
                            }))}
                            value={make}
                            onChange={(value) => {
                                setMake(value)
                                setModel("") // Reset model when make changes
                                setAvailableModels({})
                                fetchModels(value)
                            }}
                            placeholder="Select Make"
                            isLoading={loadingMakes}
                            disabled={!weightClass}
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-brand">*Model</label>
                        <SearchableSelect
                            options={Object.keys(availableModels).map((model) => ({
                                value: model,
                                label: model,
                            }))}
                            value={model}
                            onChange={setModel}
                            placeholder="Select Model"
                            disabled={!make}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Option to change between East and West Malaysia */}
                <div className="flex flex-col gap-2 border-b-2 border-brand/20 pb-4">
                    <label className="text-brand font-medium">*Region</label>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="west"
                                name="region"
                                value="west"
                                checked={region === 'west'}
                                onChange={(e) => setRegion(e.target.value)}
                                disabled={!weightClass}
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
                                disabled={!weightClass}
                                className="w-4 h-4 accent-brand"
                            />
                            <label htmlFor="east">East Malaysia</label>
                        </div>
                    </div>
                </div>

                {/* Commercial Vehicle Query */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Vehicle identity */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs">Basic vehicle information</p>
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
                                <option value="wooden_cargo">Wooden Cargo</option>
                                <option value="metal_cargo">Metal Cargo</option>
                                <option value="box_van">Box Van</option>
                                <option value="curtain_sider">Curtain Sider</option>
                                <option value="refrigerated">Refrigerated</option>
                                <option value="tipper">Tipper</option>
                                <option value="flatbed">Flatbed</option>
                                <option value="crane_cargo">Crane Cargo</option>
                                <option value="tanker">Tanker</option>
                                <option value="car_carrier">Car Carrier</option>
                                <option value="tow_truck">Tow Truck</option>
                                <option value="mixer">Mixer</option>
                                <option value="trailer">Trailer</option>
                                <option value="other">Other</option>
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
                        <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Technical Specifications</h3>
                            <p className="text-xs">Engine and performance details</p>
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

                        <div className="grid grid-cols-2 gap-4">
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

                        {/* BDM & BTM */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">*BDM (KG)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 7500"
                                    value={bdm}
                                    onChange={(e) => setBdm(e.target.value)}
                                    disabled={fieldsDisabled}
                                    className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                                />
                                {/* <p className="text-[10px] text-foreground/60 mt-0.5">Weight with load</p> */}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">*BTM (KG)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 3500"
                                    value={btm}
                                    onChange={(e) => setBtm(e.target.value)}
                                    disabled={fieldsDisabled}
                                    className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                                />
                                {/* <p className="text-[10px] text-foreground/60 mt-0.5">Weight without load</p> */}
                            </div>
                        </div>

                        {/* Driven Wheel & Seat Capacity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">*Driven Wheel</label>
                                <select
                                    value={drivenWheel}
                                    onChange={(e) => setDrivenWheel(e.target.value)}
                                    disabled={fieldsDisabled}
                                    className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                                >
                                    <option value="">--</option>
                                    <option value="2wd">2WD</option>
                                    <option value="4wd">4WD</option>
                                    <option value="6wd">6WD</option>
                                    <option value="awd">AWD</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">*Seat Capacity</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 2"
                                    value={seatCapacity}
                                    onChange={(e) => setSeatCapacity(e.target.value)}
                                    disabled={fieldsDisabled}
                                    className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Condition & Value */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Condition & Value</h3>
                            <p className="text-xs">Usage and valuation data</p>
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
                                placeholder="E.g. 123456"
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
                            // onClick={handleSubmit}
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
                            title="Clears all fields and valuation results"
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