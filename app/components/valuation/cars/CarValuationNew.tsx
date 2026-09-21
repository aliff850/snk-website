"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { ArrowDown, RotateCcw } from 'lucide-react'
import SearchableSelect from '@/app/components/ui/SearchableSelect'
import { Button } from "../../../ui/ButtonComponent"
import { mileageOptions, yearOptions } from "../../ranges"
import { RegionSelection } from "../../shared/RegionSelection"
import { MakeModelPopup } from "../../shared/MakeModelPopup"
import { scrollToElement } from "@/app/components/ui/SmoothScroll"

interface CarValuationNewProps {
    onSearch: (searchData: any) => void
    onReset?: () => void
    loading?: boolean
    onSearchStart?: () => void
}

export function FormSelect({
    value,
    onChange,
    disabled,
    options,
    labelFormatter
}: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    disabled: boolean
    options: string[] | { value: string; label: string }[]
    labelFormatter?: (value: string) => string
}) {
    // Normalize options to always be { value, label } format
    const normalizedOptions = options.map(option => {
        if (typeof option === 'string') {
            // Apply custom formatter if provided, otherwise use the value as-is
            const label = labelFormatter ? labelFormatter(option) : option
            return { value: option, label }
        }
        return option
    }).filter(option => option.value !== 'Any') // Filter out 'Any' option

    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full rounded-full border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
        >
            <option value="">--</option>
            {normalizedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

interface FormBaseProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled: boolean
    placeholder: string
    className?: string
}

type FormTextInputProps = FormBaseProps & (
    | { type: "text" }
    | { type: "number"; max?: number; min?: number; step?: number }
)

export function FormTextInput({
    value,
    onChange,
    disabled,
    type,
    placeholder,
    className,
    ...rest
}: FormTextInputProps) {
    return (
        <input
            value={value}
            onChange={onChange}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-full border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20 ${className}`}
            {...rest}
        />
    )
}

export function CarValuationNew({ onSearch, onReset, loading = false, onSearchStart }: CarValuationNewProps) {
    // Auth context for token checking
    const { user, refreshTokens, getAccessToken } = useAuth()

    // Label formatters for FormSelect components
    const formatMileage = (value: string) => `${Number(value).toLocaleString()}+`
    const formatEngineCapacity = (value: string) => `${value}L`

    const [isLoading, setIsLoading] = useState(false)
    // States for make, model, and region
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [region, setRegion] = useState("west")

    // States for make and model
    const [availableMakes, setAvailableMakes] = useState<Record<string, any>>({})
    const [availableModels, setAvailableModels] = useState<Record<string, string>>({})
    const [loadingMakes, setLoadingMakes] = useState(false)
    const [loadingModels, setLoadingModels] = useState(false)

    // States for all filters (for both mudah and carlist)
    const [fromOffset, setFromOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(50)
    const [type, setType] = useState("sell")
    const [fuelType, setFuelType] = useState("")
    const [condition, setCondition] = useState("")
    const [transmission, setTransmission] = useState("")
    const [bodyType, setBodyType] = useState("")
    const [electricMotorWatts, setElectricMotorWatts] = useState<string>("")

    // Insurable values options lists (populated from API based on make+model)
    const [variantOptions, setVariantOptions] = useState<string[]>([])
    const [ccOptions, setCcOptions] = useState<string[]>([])
    const [styleOptions, setStyleOptions] = useState<string[]>([])

    // Available manufacture years (fetched from DB based on make+model)
    const [availableYears, setAvailableYears] = useState<string[]>([])
    const [loadingYears, setLoadingYears] = useState<boolean>(false)

    // Insurable values selected values (what the user has chosen)
    const [selectedVariant, setSelectedVariant] = useState<string>("")
    const [selectedCC, setSelectedCC] = useState<string>("")
    const [selectedStyle, setSelectedStyle] = useState<string>("")
    const [loadingFormOptions, setLoadingFormOptions] = useState<boolean>(false)

    // Mudah specific states
    const [origin, setOrigin] = useState("")
    const [engineCapacityLiter, setEngineCapacityLiter] = useState<string>("")
    const [yearFrom, setYearFrom] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    const [insuredPrice, setInsuredPrice] = useState<string>("")

    // Carlist states
    const [carlistMakes, setCarlistMakes] = useState<Record<string, any>>({})
    const [carlistModels, setCarlistModels] = useState<Record<string, string | null>>({})
    const [loadingCarlistMakes, setLoadingCarlistMakes] = useState(false)

    // Helper function to slugify strings
    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")

    // Helper function to determine if the form can be submitted
    // Make sure make and model are not empty
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])
    const fieldsDisabled = !canSubmit
    // Fields that depend on year being selected (everything below the Year dropdown)
    const detailFieldsDisabled = fieldsDisabled || !yearFrom

    const [showPopup, setShowPopup] = useState(false)
    // const componentRef = useRef<HTMLDivElement>(null)
    // Function to fetch both Mudah and Carlist make and models
    // Instead of fetching one by one, we can fetch both at the same time
    // Uses Promise.allSettled to handle errors
    const fetchAllMakes = async () => {
        setLoadingMakes(true)
        try {
            // Fetch both Mudah and Carlist at the same time
            const [mudahResult, carlistResult] = await Promise.allSettled([
                fetch('/api/mudah/all_vehicles'),
                fetch('/api/carlist/all_vehicles')
            ])

            // Process Mudah
            if (mudahResult.status === 'fulfilled' && mudahResult.value.ok) {
                const data = await mudahResult.value.json()
                setAvailableMakes(data)
            } else {
                console.error("Mudah makes fetch failed")
                setAvailableMakes({})
            }

            // Process Carlist
            if (carlistResult.status === 'fulfilled' && carlistResult.value.ok) {
                const data = await carlistResult.value.json()
                setCarlistMakes(data)
            } else {
                console.error("Carlist makes fetch failed")
                setCarlistMakes({})
            }

        } catch (e) {
            console.error('Failed to fetch makes:', e)
        } finally {
            setLoadingMakes(false)
        }
    }

    // Helper function to check if make exists in Mudah
    const makeExistsInMudah = useMemo(() => {
        if (!make) return false
        // checks in the availableMakes object if the make exists and returns true if it does
        return Object.keys(availableMakes).includes(make.toLowerCase())
    }, [availableMakes, make])

    // Same for Carlist
    const makeExistsInCarlist = useMemo(() => {
        if (!make) return false
        // checks in the carlistMakes object if the make exists and returns true if it does
        return Object.keys(carlistMakes).includes(make.toLowerCase())
    }, [carlistMakes, make])

    // Helper function to fetch both Mudah and Carlist models
    // This is dependent on the make being selected
    const fetchAllModels = async (makeSlug: string) => {

        try {
            setLoadingModels(true)
            // Try to fetch both Mudah and Carlist at once

            // Build fetch promises only for platforms that have the make
            // Fetch promises are basically just the fetch calls to the API
            const fetchPromises: Promise<Response>[] = []
            // Flags to track which platforms have the make
            const platformFlags = { mudah: false, carlist: false }

            // If make exists in Mudah, add the fetch promise for Mudah
            if (makeExistsInMudah) {
                fetchPromises.push(fetch(`/api/mudah/all_vehicles?make=${encodeURIComponent(makeSlug)}`))
                platformFlags.mudah = true
            }
            // If make exists in Carlist, add the fetch promise for Carlist
            if (makeExistsInCarlist) {
                fetchPromises.push(fetch(`/api/carlist/all_vehicles?make=${encodeURIComponent(makeSlug)}`))
                platformFlags.carlist = true
            }

            // If no fetch promises were built, it means the make does not exist in any platform
            // Not a likely scenario but good to handle regardless
            if (fetchPromises.length === 0) {
                console.log(`Make ${make} does not exist in any platform`)
                setAvailableModels({})
                setCarlistModels({})
                return
            }

            // Fetch only from available platforms
            const results = await Promise.allSettled(fetchPromises)
            let resultsIndex = 0

            // Process Mudah models
            // If status is fulfilled and response is ok, set the available models
            // If status is rejected or response is not ok, set the available models to empty object

            if (platformFlags.mudah) {
                // If Mudah flag is true, then we need to process the Mudah models
                // mudahResult is the result of the fetch call to the Mudah API
                const mudahResult = results[resultsIndex++] as PromiseSettledResult<Response>

                if (mudahResult.status === 'fulfilled' && mudahResult.value.ok) {
                    const data = await mudahResult.value.json()
                    setAvailableModels(data)
                } else {
                    console.error("Mudah models fetch failed for make", make)
                    setAvailableModels({})
                }
            }

            // Process Carlist models
            if (platformFlags.carlist) {
                // If Carlist flag is true, then we need to process the Carlist models
                const carlistResult = results[resultsIndex++] as PromiseSettledResult<Response>

                if (carlistResult.status === 'fulfilled' && carlistResult.value.ok) {
                    const data = await carlistResult.value.json()
                    setCarlistModels(data)
                } else {
                    console.error("Carlist models fetch failed for make", make)
                    setCarlistModels({})
                }
            }

        } catch (e) {
            console.error('Failed to fetch models:', e)
        } finally {
            setLoadingModels(false)
        }
    }

    // Helper function to check if model exists in Mudah
    const modelExistsInMudah = useMemo(() => {
        if (!model) return false
        // Checks availableModels object if the model exists and returns true if it does
        return Object.keys(availableModels).includes(model.toLowerCase())
    }, [availableModels, model])

    // Helper function to check if model exists in Carlist
    const modelExistsInCarlist = useMemo(() => {
        if (!model) return false
        // Checks carlistModels object as well
        return Object.keys(carlistModels).includes(model.toLowerCase())
    }, [carlistModels, model])

    // Fetch makes on mount
    useEffect(() => {
        fetchAllMakes()
    }, [])

    // Refetch models when source changes if make is already selected
    useEffect(() => {
        if (make) {
            const makeSlug = slug(make)
            fetchAllModels(makeSlug)
        }
    }, [make]) // Fetch once when make is selected

    // Resets all fields that sit below the Year selector
    const resetDetailFields = () => {
        // DB-fetched variant/cc/style options
        setVariantOptions([])
        setCcOptions([])
        setStyleOptions([])
        // DB-derived selections
        setSelectedVariant("")
        setSelectedCC("")
        setSelectedStyle("")
        // User-chosen fields
        setFuelType("")
        setTransmission("")
        setCondition("")
        setMileageFrom("")
        setOrigin("")
        setBodyType("")
        setInsuredPrice("")
        setElectricMotorWatts("")
    }

    // When make+model change, fetch available manufacture years from DB
    useEffect(() => {
        if (make && model) {
            getAvailableYears()
        } else {
            // If make or model was cleared then reset year, available years, and everything downstream
            setYearFrom("")
            setAvailableYears([])
            resetDetailFields()
        }
    }, [make, model])

    // Once make+model+yearFrom are all set, fetch variant/series/style/cc
    useEffect(() => {
        if (make && model && yearFrom) {
            // If year is changed then reset downstream fields before fetching new options for the new year
            resetDetailFields()
            getFormOptions()
        } else {
            // If year is cleared then reset downstream fields
            resetDetailFields()
        }
    }, [make, model, yearFrom])

    // Function which merges all makes from both sources so that we can display them in the dropdown
    const unifiedMakes = useMemo(() => {
        const makes = new Set<string>()
        // For each make in availableMakes (mudah), add it to the set
        Object.keys(availableMakes).forEach(m => makes.add(m))
        // For each make in carlistMakes (carlist), add it to the set
        Object.keys(carlistMakes).forEach(m => makes.add(m))
        // Merge all available makes and models
        return Array.from(makes).sort()
        // Any make that is in both sources will only appear once
    }, [availableMakes, carlistMakes])

    // Function which merges all models from both sources so that we can display them in the dropdown
    const unifiedModels = useMemo(() => {
        const models = new Set<string>()
        // For each model in availableModels (mudah), add it to the set
        Object.keys(availableModels).filter(k => k !== '__id__').forEach(m => models.add(m))
        // For each model in carlistModels (carlist), add it to the set
        Object.keys(carlistModels).forEach(m => models.add(m))
        return Array.from(models).sort()
        // Any model that is in both sources will only appear once
    }, [availableModels, carlistModels])

    // Function which resets all fields
    const resetAll = () => {
        setMake("")
        setModel("")
        setFromOffset(0)
        setLimit(50) // Always returns 50 results
        setType("sell")
        setFuelType("")
        setCondition("")
        setOrigin("")
        setTransmission("")
        setBodyType("")
        setYearFrom("")
        setMileageFrom("")
        setInsuredPrice("")
        setEngineCapacityLiter("")
        // Reset insurable value selections and options
        setAvailableYears([])
        setSelectedVariant("")
        setSelectedCC("")
        setSelectedStyle("")
        setVariantOptions([])
        setCcOptions([])
        setStyleOptions([])
        setCarlistModels({})
        setAvailableModels({})
        if (onReset) {
            onReset()
        }
    }

    // All fetch functions
    // Fetch available manufacture years for a given make+model from the vehicle database
    const getAvailableYears = async () => {
        setLoadingYears(true)
        // Clear the previously-selected year and downstream options whenever years reload
        setYearFrom("")
        setVariantOptions([])
        setCcOptions([])
        setStyleOptions([])
        setSelectedVariant("")
        setSelectedCC("")
        setSelectedStyle("")
        try {
            const params = new URLSearchParams({ make, model })
            const response = await fetch(`/api/insurable/years?${params}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await response.json()
            setAvailableYears((data.years ?? []).map(String))
        } catch (e: any) {
            console.log("Error fetching available years:", e)
            setAvailableYears([])
        } finally {
            setLoadingYears(false)
        }
    }

    // Function to fetch form select options from master database based on make and model
    const getFormOptions = async () => {
        setLoadingFormOptions(true)
        try {
            console.log("Fetching details for ", yearFrom, make, model)
            // Send make and model as query params
            const params = new URLSearchParams({ make, model, year: yearFrom })
            // We use API endpoint where after we send the make and model, it will query the vehicle database and it returns lists containing variant, series, year, cc based on the make and model
            // Then we will dynamically populate the valuation form select inputs with these lists
            const response = await fetch(`/api/insurable/details?${params}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            // Data is returned as { variant: string[], series: string[], style: string[], cc: number[] }
            const data = await response.json()
            console.log("Form options fetched:", data)

            // Populate the options lists and convert cc numbers to strings for FormSelect
            setVariantOptions(data.variant ?? [])
            setCcOptions((data.cc ?? []).map(String))
            setStyleOptions(data.style ?? [])

            // Reset the user's current selections since make/model has changed
            setSelectedVariant("")
            setSelectedCC("")
            setSelectedStyle("")

        } catch (e: any) {
            console.log("Error fetching form options:", e)
        } finally {
            setLoadingFormOptions(false)
        }
    }

    // Function to get the insurable values
    // After the filters have been fetched
    const getInsurableValues = async () => {
        // Logic to be added
    }

    // Remember:For both Carlist and Mudah, most important filters are Year and Mileage
    // Function to handle the form submission
    const handleSubmit = async () => {
        // If make or model is empty, show make model popup
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
            // Get access token for API auth
            const accessToken = await getAccessToken()
            if (!accessToken) {
                onSearch({ error: "Authentication error. Please log in again." })
                return
            }

            const makeSlug = slug(make)
            const modelSlug = slug(model)

            // Build Mudah search params (ascending + descending)
            const mudahSearchQuery: Record<string, any> = {
                make_id: makeSlug,
                model_id: modelSlug,
                From: fromOffset,
                limit,
                sortby: 'price_asc',
                type
            }
            // If year is less than 1995, set it to 1995
            const effectiveYear = yearFrom && parseInt(yearFrom, 10) < 1995 ? "1995" : yearFrom
            const yearQuery = effectiveYear ? `${effectiveYear}-${effectiveYear}` : ""

            if (yearQuery) mudahSearchQuery.mfg_year = yearQuery
            if (fuelType) mudahSearchQuery.fueltype = fuelType
            if (bodyType) {
                const mudahBodyMap: Record<string, string> = {
                    'sedan': 'sedan', 'hatchback': 'hatchback', 'suv': 'suvs',
                    'mpv': 'mpvs', 'coupe': 'coupe', 'pickup': 'pick_up',
                    'convertible': 'sports', 'wagon': 'other', 'van': 'other'
                }
                if (mudahBodyMap[bodyType]) mudahSearchQuery.car_type_id = mudahBodyMap[bodyType]
            }
            if (mileageFrom) {
                const m = parseInt(mileageFrom, 10)
                if (!Number.isNaN(m)) mudahSearchQuery.mileage = `${mileageFrom}-${m + 5000}`
            }
            if (transmission) mudahSearchQuery.transmission_id = transmission

            // Build Carlist search params (Variant Filter Removed)
            const carlistQuery: Record<string, any> = {
                make: makeSlug,
                model: modelSlug,
                condition: 'used'
            }
            
            // Note: Strict variant filter is intentionally omitted to avoid over-filtering
            
            if (bodyType) {
                const bodyTypeMap: Record<string, string> = {
                    'sedan': 'sedan', 'hatchback': 'Hatchback', 'suv': 'suv',
                    'mpv': 'MPV', 'coupe': 'Coupe', 'pickup': 'pickup',
                    'convertible': 'Convertible', 'wagon': 'wagon', 'van': 'van'
                }
                carlistQuery.body_type = bodyTypeMap[bodyType] || bodyType
            }
            const carlistFilters: Record<string, any> = { page_size: 50, sort: 'asc' }
            // If year is less than 1995, set it to 1995
            if (yearFrom) {
                const y = Math.max(1995, parseInt(yearFrom, 10))
                carlistFilters.min_year = y
                carlistFilters.max_year = y
            }
            if (transmission) {
                const transMap: Record<string, string> = { 'auto': 'Automatic', 'manual': 'Manual' }
                carlistFilters.transmission = transMap[transmission] || transmission
            }
            if (fuelType) {
                const fuelMap: Record<string, string> = {
                    'petrol': 'Petrol', 'diesel': 'Diesel', 'hybrid': 'Hybrid', 'electric': 'Electric'
                }
                carlistFilters.fuel_type = fuelMap[fuelType] || fuelType
            }
            if (mileageFrom) {
                const m = parseInt(mileageFrom, 10)
                carlistFilters.min_mileage = m
                carlistFilters.max_mileage = m + 5000
            }

            // Build the unified request
            const requestBody: Record<string, any> = {
                vehicle_type: 'car',
            }

            // Only include sources that have the make/model
            if (makeExistsInMudah && modelExistsInMudah) {
                requestBody.mudah = {
                    searchQuery: mudahSearchQuery,
                    whitelist_attributes: [
                        'model_name', 'make_name', 'condition_name', 'manufactured_year',
                        'fueltype', 'price', 'mileage', 'transmission_name',
                        'engine_capacity', 'car_type_name', 'adview_url', 'image', 'variant'
                    ]
                }
            }
            if (makeExistsInCarlist && modelExistsInCarlist) {
                requestBody.carlist = {
                    query: carlistQuery,
                    filters: carlistFilters,
                    whitelist_attributes: [
                        "brand.name", "model", "itemCondition", "vehicleModelDate",
                        "fuelType", "offers.price", "mileageFromOdometer.value",
                        "vehicleTransmission", "image[0].url", "mainEntityOfPage"
                    ]
                }
            }

            // If neither source has make/model, return error
            if (!requestBody.mudah && !requestBody.carlist) {
                onSearch({ error: "Vehicle make/model not found in any data source." })
                return
            }

            // Always include insurable search if we have make, model and year
            if (make && model && yearFrom) {
                const capacityValue = fuelType === 'electric' ? electricMotorWatts : selectedCC
                const insurableDetail: Record<string, any> = {
                    make: make.toUpperCase(),
                    model: model.toUpperCase(),
                    year: yearFrom,
                }
                if (selectedVariant) insurableDetail.variant = selectedVariant.toUpperCase()
                if (capacityValue) insurableDetail.cc = capacityValue
                if (transmission) insurableDetail.transmission = transmission.toUpperCase()
                if (selectedStyle) insurableDetail.style = selectedStyle.toUpperCase()

                requestBody.insurable = {
                    vehicle_detail: insurableDetail
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

            // Refresh token count in AuthContext
            await refreshTokens()

            // Process results from unified response
            const results: any[] = []

            // Process Mudah results
            if (data.results?.mudah) {
                const mudahListings = Array.isArray(data.results.mudah) ? data.results.mudah : []

                // Deduplicate using adview_url
                const listingsMap: Record<string, any> = {}
                mudahListings.forEach((listing: any) => {
                    if (listing.adview_url) listingsMap[listing.adview_url] = listing
                })
                const allListings = Object.values(listingsMap)
                const ascending = [...allListings].sort((a: any, b: any) => a.price - b.price)
                const descending = [...allListings].sort((a: any, b: any) => b.price - a.price)

                results.push({
                    listings: ascending,
                    listingsAscending: ascending,
                    listingsDescending: descending,
                    make: makeSlug,
                    model: modelSlug,
                    vehicleType: 'car',
                    source: 'Mudah'
                })
            }

            // Process Carlist results
            if (data.results?.carlist) {
                const carlistListings = Array.isArray(data.results.carlist) ? data.results.carlist : []

                // Deduplicate + normalize
                const listingsMap: Record<string, any> = {}
                carlistListings.forEach((listing: any) => {
                    const normalized = {
                        ...listing,
                        price: listing['offers.price'] || listing.price,
                        image: listing['image[0].url'] || listing.image,
                        url: listing['mainEntityOfPage'] || listing.url
                    }
                    // THE FIX: Use the unique URL as the key to prevent price collisions!
                    const key = normalized.url
                    listingsMap[key] = normalized
                })
                const allListings = Object.values(listingsMap)
                const ascending = [...allListings].sort((a: any, b: any) => {
                    return (a['offers.price'] || 0) - (b['offers.price'] || 0)
                })
                const descending = [...allListings].sort((a: any, b: any) => {
                    return (b['offers.price'] || 0) - (a['offers.price'] || 0)
                })

                results.push({
                    listings: ascending,
                    listingsAscending: ascending,
                    listingsDescending: descending,
                    make: make,
                    model: model,
                    vehicleType: 'car',
                    source: 'Carlist'
                })
            }

            // Construct user inputs
            const currentUserInputs = {
                make, model, region, year: yearFrom, style: selectedStyle,
                cc: selectedCC,
                electricMotorWatts: electricMotorWatts,
                fuelType, transmission,
                origin, condition, mileage: mileageFrom, insuredPrice,
                variant: selectedVariant,
            }

            // Include insurable data if available
            const insurableData = data.results?.insurable || null

            if (results.length === 0) {
                // Even if no market listings, we may have insurable data
                if (insurableData && !insurableData.meta) {
                    onSearch({
                        listings: [],
                        listingsAscending: [],
                        listingsDescending: [],
                        source: 'None',
                        vehicleType: 'car',
                        userInputs: currentUserInputs,
                        insurable: insurableData,
                        counts: { total: 0 }
                    })
                    return
                }
                onSearch({ error: data.errors ? JSON.stringify(data.errors) : "No results from source" })
                return
            }

            if (results.length === 1) {
                const result = results[0]
                onSearch({
                    ...result,
                    userInputs: currentUserInputs,
                    insurable: insurableData,
                    counts: {
                        [result.source.toLowerCase()]: result.listings.length,
                        total: result.listings.length
                    }
                })
            } else {
                const combinedListings = results.flatMap(r => r.listings)
                const getPrice = (listing: any) => listing.price || listing['offers.price'] || 0
                const combinedAscending = [...combinedListings].sort((a, b) => getPrice(a) - getPrice(b))
                const combinedDescending = [...combinedListings].sort((a, b) => getPrice(b) - getPrice(a))

                onSearch({
                    listings: combinedListings,
                    listingsAscending: combinedAscending,
                    listingsDescending: combinedDescending,
                    source: 'Combined',
                    vehicleType: 'car',
                    userInputs: currentUserInputs,
                    insurable: insurableData,
                    counts: {
                        mudah: results.find(r => r.source === 'Mudah')?.listings.length || 0,
                        carlist: results.find(r => r.source === 'Carlist')?.listings.length || 0,
                        total: combinedListings.length
                    }
                })
            }
        } catch (e: any) {
            console.log(e)
            onSearch({ error: e?.message || "Something went wrong" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form id="car-form" className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="car-form" className="sr-only">Car Valuation Form</label>
                {/* Option to change between East, West Malaysia and Langkawi */}
                <RegionSelection
                    value={region}
                    onChange={setRegion}
                />

                <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                    <h3 className="text-lg font-bold text-brand">Car Make/Model</h3>
                    <p className="text-xs text-foreground">Select the make and model of the vehicle</p>
                </div>
                {/* Make/Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-brand font-medium">*Make</label>
                        <SearchableSelect
                            value={make}
                            onChange={(val) => {
                                setMake(val)
                                // Models are fetched via effect when make changes
                                if (!val) {
                                    setModel("")
                                    setAvailableModels({})
                                    setCarlistModels({})
                                }
                            }}
                            options={unifiedMakes.map(makeKey => ({
                                value: makeKey,
                                label: makeKey.replace(/-/g, ' ').toUpperCase()
                            }))}
                            placeholder="Select a make..."
                            disabled={loadingMakes || loadingCarlistMakes}
                            isLoading={loadingMakes || loadingCarlistMakes}
                            emptyMessage="No makes found"
                        />
                    </div>

                    <div>
                        <label className="block text-brand font-medium">*Model</label>

                        <SearchableSelect
                            value={model}
                            onChange={(val) => setModel(val)}
                            options={unifiedModels.map(modelKey => ({
                                value: modelKey,
                                label: modelKey.replace(/-/g, ' ').toUpperCase()
                            }))}
                            placeholder="Select a model..."
                            disabled={!make || (unifiedModels.length === 0)}
                            emptyMessage={make ? "No models found for this make" : "Select a make first"}
                        // Extra handling for when the model is not found
                        />
                    </div>
                </div>

                {/* Vehicle Listing Query */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Vehicle identity */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                            <h3 className="text-lg font-bold text-brand">Vehicle Identity</h3>
                            <p className="text-xs">Basic vehicle information</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                *Year
                                {loadingYears && <span className="ml-2 text-xs text-foreground/50">Loading...</span>}
                            </label>
                            {availableYears.length == 0 ? (
                                // Fallback to base years if no years found for this make & model from the DB
                                <FormSelect
                                    value={yearFrom}
                                    onChange={(e) => setYearFrom(e.target.value)}
                                    disabled={fieldsDisabled || loadingYears}
                                    options={yearOptions}
                                />

                            ) : (
                                <FormSelect
                                    value={yearFrom}
                                    onChange={(e) => setYearFrom(e.target.value)}
                                    disabled={fieldsDisabled || loadingYears || availableYears.length === 0}
                                    options={availableYears.length > 0 ? availableYears : []}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Body Type</label>
                            {/* Default to predefined body types if there are no style options for selected vehicle make and model */}
                            {styleOptions.length == 0 ? (
                                <FormSelect
                                    value={selectedStyle}
                                    onChange={(e) => setSelectedStyle(e.target.value)}
                                    disabled={detailFieldsDisabled}
                                    options={[
                                        { value: "sedan", label: "4D Sedan" },
                                        { value: "hatchback", label: "4D Hatchback" },
                                        { value: "2dhatchback", label: "2D Hatchback" },
                                        { value: "wagon", label: "4D Wagon" },
                                        { value: "4dcoupe", label: "4D Coupe" },
                                        { value: "coupe", label: "2D Coupe" },
                                        { value: "suv", label: "4D SUV" },
                                        { value: "2dsuv", label: "2D SUV" },
                                        { value: "pickup", label: "4D Pick-up" },
                                        { value: "2dpickup", label: "2D Pick-up" },
                                        { value: "mpv", label: "MPV" },
                                        { value: "convertible", label: "Convertible" },
                                        { value: "van", label: "Van" },
                                    ]}
                                />
                            ) : (
                                <FormSelect
                                    value={selectedStyle}
                                    onChange={(e) => setSelectedStyle(e.target.value)}
                                    disabled={detailFieldsDisabled}
                                    options={styleOptions.map((style) => ({ value: style, label: style }))}
                                />
                            )}
                        </div>

                        {/* Variant */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Variant</label>
                            </div>
                            {variantOptions.length == 0 ? (

                                <FormTextInput
                                    value={selectedVariant}
                                    onChange={(e) => setSelectedVariant(e.target.value)}
                                    disabled={detailFieldsDisabled}
                                    type="text"
                                    placeholder="example: Premium"
                                />

                            ) : (

                                <FormSelect
                                    value={selectedVariant}
                                    onChange={(e) => setSelectedVariant(e.target.value)}
                                    disabled={variantOptions.length == 0 || detailFieldsDisabled || loadingFormOptions}
                                    options={variantOptions}

                                />
                            )}
                        </div>

                        {/* Origin */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">*Import Status</label>
                            </div>
                            <FormSelect
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                disabled={detailFieldsDisabled}
                                options={[
                                    { value: "New Local", label: "New Local" },
                                    { value: "New Import", label: "New Import" },
                                    { value: "Used Local", label: "Used Local" },
                                    { value: "Used Import", label: "Used Import" },
                                    { value: "Rebuilt", label: "Rebuilt" },
                                    { value: "Recon", label: "Recon" }
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
                            <label className="block text-sm font-medium mb-1">*Fuel Type</label>
                            <FormSelect
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                disabled={!origin || detailFieldsDisabled}
                                options={[
                                    { value: "petrol", label: "Petrol" },
                                    { value: "diesel", label: "Diesel" },
                                    { value: "hybrid", label: "Hybrid" },
                                    { value: "electric", label: "Electric" },
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Transmission</label>
                            <FormSelect
                                value={transmission}
                                onChange={(e) => setTransmission(e.target.value)}
                                disabled={!fuelType || detailFieldsDisabled}
                                options={
                                    fuelType == "electric" ? [
                                        { value: "auto", label: "Automatic" },
                                    ] : [
                                        { value: "auto", label: "Automatic" },
                                        { value: "manual", label: "Manual" },
                                    ]
                                }
                            />
                        </div>

                        {/* Engine Capacity */}
                        {/* If fuel type is other than electric, display engine capacity */}
                        {fuelType !== "electric" && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium">*Engine Capacity (cc)</label>
                                </div>
                                {ccOptions.length == 0 ? (
                                    <FormTextInput
                                        value={selectedCC}
                                        onChange={(e) => setSelectedCC(e.target.value)}
                                        disabled={!transmission || detailFieldsDisabled}
                                        type="number"
                                        min={0}
                                        max={10000}
                                        step={1000}
                                        placeholder="e.g. 1332"
                                    />
                                ) : (
                                    <FormSelect
                                        value={selectedCC}
                                        onChange={(e) => setSelectedCC(e.target.value)}
                                        disabled={!transmission || detailFieldsDisabled || loadingFormOptions}
                                        options={ccOptions}
                                    />
                                )}
                            </div>
                        )
                        }
                        {fuelType === "electric" && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium">*Electric Motor Kilowatts</label>
                                </div>
                                <FormTextInput
                                    value={electricMotorWatts}
                                    onChange={(e) => setElectricMotorWatts(e.target.value)}
                                    disabled={!transmission || detailFieldsDisabled}
                                    type="number"
                                    min={0}
                                    step={1000}
                                    placeholder="e.g. 200"
                                />
                            </div>
                        )}
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
                                disabled={!selectedCC && !electricMotorWatts || detailFieldsDisabled}
                                options={[
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
                                disabled={!selectedCC && !electricMotorWatts || detailFieldsDisabled}
                                options={mileageOptions}
                                labelFormatter={formatMileage}
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
                                disabled={!selectedCC && !electricMotorWatts || detailFieldsDisabled}
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
                            // href="#valuation"
                            onClick={() => {
                                handleSubmit()
                                // Small delay to allow react to render the results wrapper or start loading
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
                            // href="#main"
                            onClick={() => {
                                resetAll()
                                scrollToElement("main")
                            }}
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