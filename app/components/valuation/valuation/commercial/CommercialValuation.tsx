"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw, Truck } from 'lucide-react'
import SearchableSelect from '@/app/components/ui/SearchableSelect'
import { Button } from "../../../ui/ButtonComponent"
import { SelectionButtonGroup } from "../../shared/SelectionButtonGroup"
import { RegionSelection } from "../../shared/RegionSelection"
import { yearOptions, mileageOptions, engineCapacityOptionsLiters } from "../../ranges"
import { FormSelect, FormTextInput } from "../cars/CarValuationNew"
import { MakeModelPopup } from "../../shared/MakeModelPopup"

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

    const [showPopup, setShowPopup] = useState(false)

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

        // Reset Carlist specific
        setCarlistVariant("")

        setCarlistModels({})
        setAvailableModels({})

        if (onReset) {
            onReset()
        }
    }

    const handleSubmit = () => {
        setShowPopup(true)
        return
    }

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form id="commercial-form" className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="commercial-form" className="sr-only">Commercial Valuation Form</label>
                {/* Option to change between East and West Malaysia */}
                <RegionSelection
                    value={region}
                    onChange={setRegion}
                />

                <div className="flex flex-col gap-4 pb-4 border-b-2 border-brand/20">
                    {/* Weight class selection */}
                    <SelectionButtonGroup
                        items={[
                            { id: 'below10ton', label: 'Below 10 Ton', icon: Truck },
                            { id: 'above10ton', label: 'Above 10 Ton', icon: Truck }
                        ]}
                        value={weightClass}
                        onChange={setWeightClass}
                        disabled={!region}
                    />
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
                            <FormSelect
                                value={yearFrom}
                                onChange={(e) => setYearFrom(e.target.value)}
                                disabled={fieldsDisabled}
                                options={yearOptions}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Body Type</label>
                            <FormSelect
                                value={bodyType}
                                onChange={(e) => setBodyType(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "", label: "--" },
                                    { value: "wooden_cargo", label: "Wooden Cargo" },
                                    { value: "metal_cargo", label: "Metal Cargo" },
                                    { value: "box_van", label: "Box Van" },
                                    { value: "curtain_sider", label: "Curtain Sider" },
                                    { value: "refrigerated", label: "Refrigerated" },
                                    { value: "tipper", label: "Tipper" },
                                    { value: "flatbed", label: "Flatbed" },
                                    { value: "crane_cargo", label: "Crane Cargo" },
                                    { value: "tanker", label: "Tanker" },
                                    { value: "car_carrier", label: "Car Carrier" },
                                    { value: "tow_truck", label: "Tow Truck" },
                                    { value: "mixer", label: "Mixer" },
                                    { value: "trailer", label: "Trailer" },
                                    { value: "other", label: "Other" },
                                ]}
                            />
                        </div>

                        {/* Variant */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Variant</label>
                            </div>
                            <FormTextInput
                                placeholder="e.g., 1.5G"
                                disabled={fieldsDisabled}
                                type="text"
                                value={carlistVariant}
                                onChange={(e) => setCarlistVariant(e.target.value)}
                            />
                        </div>

                        {/* Origin */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Origin</label>
                            </div>
                            <FormSelect
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "", label: "--" },
                                    { value: "New Local", label: "New Local" },
                                    { value: "New Import", label: "New Import" },
                                    { value: "Recon", label: "Reconditioned" },
                                    { value: "CBU", label: "CBU" },
                                    { value: "CKD", label: "CKD" },
                                ]}
                            />
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
                            <FormSelect
                                value={transmission}
                                onChange={(e) => setTransmission(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "", label: "--" },
                                    { value: "Automatic", label: "Automatic" },
                                    { value: "Manual", label: "Manual" },
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">*Fuel Type</label>
                                <FormSelect
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    disabled={fieldsDisabled}
                                    options={[
                                        { value: "", label: "--" },
                                        { value: "petrol", label: "Petrol" },
                                        { value: "hybrid", label: "Hybrid" },
                                        { value: "diesel", label: "Diesel" },
                                        { value: "electric", label: "Electric" },
                                    ]}
                                />
                            </div>

                            {/* Engine Capacity */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium">*Engine Capacity (L)</label>
                                </div>
                                <FormSelect
                                    value={engineCapacityLiter}
                                    onChange={(e) => setEngineCapacityLiter(e.target.value)}
                                    disabled={fieldsDisabled}
                                    options={engineCapacityOptionsLiters.map(l => ({ value: l, label: l }))}
                                />
                            </div>
                        </div>

                        {/* BDM & BTM */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">*BDM (KG)</label>
                                <FormTextInput
                                    type="number"
                                    placeholder="e.g. 7500"
                                    value={bdm}
                                    onChange={(e) => setBdm(e.target.value)}
                                    disabled={fieldsDisabled}
                                />
                                {/* <p className="text-[10px] text-foreground/60 mt-0.5">Weight with load</p> */}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">*BTM (KG)</label>
                                <FormTextInput
                                    type="number"
                                    placeholder="e.g. 3500"
                                    value={btm}
                                    onChange={(e) => setBtm(e.target.value)}
                                    disabled={fieldsDisabled}
                                />
                                {/* <p className="text-[10px] text-foreground/60 mt-0.5">Weight without load</p> */}
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
                            <FormSelect
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "", label: "--" },
                                    { value: "Very Poor", label: "Very Poor" },
                                    { value: "Poor", label: "Poor" },
                                    { value: "Fair", label: "Fair" },
                                    { value: "Good", label: "Good" },
                                    { value: "Very Good", label: "Very Good" },
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mileage (KM)</label>
                            <FormSelect
                                value={mileageFrom}
                                onChange={(e) => setMileageFrom(e.target.value)}
                                disabled={fieldsDisabled}
                                options={mileageOptions.filter(v => v !== 'Any').map(m => ({ value: m, label: m }))}
                            />
                        </div>

                        {/* Insured Price - Available for both */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">Previous Insured Sum (MYR)</label>
                            </div>
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

                {/* Action Buttons */}
                <div className="flex pt-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                        <Button
                            type="button"
                            onClick={handleSubmit}
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
                            title="Clears all fields and valuation results"
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