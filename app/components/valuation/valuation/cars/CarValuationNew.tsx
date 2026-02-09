"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowDown, RotateCcw } from 'lucide-react'
import SearchableSelect from '@/app/components/ui/SearchableSelect'
import { Button } from "../../../ui/button"
import { yearOptions, mileageOptions, MIN_VALUES, engineCapacityOptionsLiters } from "../../ranges"

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
            className="w-full rounded-lg border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20"
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

export function CarValuationNew({ onSearch, onReset, loading = false, onSearchStart }: CarValuationNewProps) {
    // Helper function to assist with smooth scrolling
    const scrollToElement = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
                top: elementPosition - 100, // Offset for header/padding
                behavior: "smooth"
            })
        }
    }
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

    // Mudah specific states
    const [origin, setOrigin] = useState("")
    const [engineCapacityLiter, setEngineCapacityLiter] = useState<string>("")
    const [yearFrom, setYearFrom] = useState<string>("")
    const [mileageFrom, setMileageFrom] = useState<string>("")
    // const [priceFrom, setPriceFrom] = useState<string>("")
    const [insuredPrice, setInsuredPrice] = useState<string>("")

    // Carlist states
    const [carlistMakes, setCarlistMakes] = useState<Record<string, any>>({})
    const [carlistModels, setCarlistModels] = useState<Record<string, string | null>>({})
    const [loadingCarlistMakes, setLoadingCarlistMakes] = useState(false)

    // Carlist specific field for vehicle variants
    const [carlistVariant, setCarlistVariant] = useState("")

    // Helper function to slugify strings
    const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-")

    // Helper function to determine if the form can be submitted
    const canSubmit = useMemo(() => make.trim() && model.trim(), [make, model])
    const fieldsDisabled = !canSubmit

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
    }, [make]) // Changed dependency to make - we want to fetch once when make is selected

    // Function which merges all makes from both sources so that we can display them in the dropdown
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
        setCarlistVariant("")
        setCarlistModels({})
        setAvailableModels({})
        if (onReset) {
            onReset()
        }
    }

    // All fetch functions
    // Function to retrieve Carlist listings
    const getCarlistData = async () => {
        if (!canSubmit) return

        // Validate if make exists in Carlist
        if (!makeExistsInCarlist) {
            console.log("Make does not exist in Carlist")
            return {
                // Returns empty listings to match the expected return type of getCarlistData
                listings: [],
                listingsAscending: [],
                listingsDescending: [],
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Carlist',
                unavailable: true  // Optional flag to indicate platform doesn't support this make
            }
        }

        // Validate if model exists in Carlist
        if (!modelExistsInCarlist) {
            console.log("Model does not exist in Carlist")
            return {
                listings: [],
                listingsAscending: [],
                listingsDescending: [],
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Carlist',
                unavailable: true  // Optional flag to indicate platform doesn't support this model
            }
        }

        try {
            // Helper function to fetch listings
            const fetchCarlistData = async (sortOrder: 'asc' | 'desc') => {
                console.log("Make exists for Carlist. Make: ", make)
                console.log('Fetching Carlist data', sortOrder)
                // Get the make and model slugs
                const makeSlug = slug(make)
                const modelSlug = slug(model)
                const headers = { "Content-Type": "application/json" } // Headers for the request

                // Base Carlist search query
                const query: Record<string, any> = {
                    make: makeSlug,
                    model: modelSlug,
                    condition: 'used'
                }

                // Variant (if specified)
                if (carlistVariant) query.variant = carlistVariant

                // Map body type
                if (bodyType) {
                    // Setting the body type to fit Carlist's API requirements
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

                // Set page size and sort order
                const baseFilters: Record<string, any> = {
                    page_size: 50,
                    sort: sortOrder
                }

                // Map manufactured year range
                if (yearFrom) {
                    const y = parseInt(yearFrom, 10)
                    baseFilters.min_year = y
                    baseFilters.max_year = y
                }

                // Map transmission
                if (transmission) {
                    // Making sure auto/manual is sent as Automatic/Manual
                    const transMap: Record<string, string> = {
                        'auto': 'Automatic',
                        'manual': 'Manual'
                    }
                    baseFilters.transmission = transMap[transmission] || transmission
                }

                // Map fuel type
                if (fuelType) {
                    // Making sure petrol/diesel/hybrid/electric is sent as Petrol/Diesel/Hybrid/Electric
                    const fuelMap: Record<string, string> = {
                        'petrol': 'Petrol',
                        'diesel': 'Diesel',
                        'hybrid': 'Hybrid',
                        'electric': 'Electric'
                    }
                    baseFilters.fuel_type = fuelMap[fuelType] || fuelType
                }

                // Use mileage with 5000 KM window
                if (mileageFrom) {
                    const m = parseInt(mileageFrom, 10)
                    baseFilters.min_mileage = m
                    baseFilters.max_mileage = m + 5000
                }

                // After all filters are set, fetch the data
                const res = await fetch("/api/carlist/search", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        query,
                        filters: baseFilters,
                        whitelist_attributes: [
                            "brand.name",
                            "model",
                            "itemCondition",
                            "vehicleModelDate",
                            "fuelType",
                            "offers.price",
                            "mileageFromOdometer.value",
                            "vehicleTransmission",
                            "image[0].url",
                            "mainEntityOfPage"
                        ]
                    })
                })

                // If response is not ok, throw error
                if (!res.ok) {
                    console.log('Failed to fetch Carlist Listings:', res.status)
                    // console.error('Failed to fetch Carlist Listings:', res.status)
                    return []
                }
                return res.json()
            }

            // Execute both fetch requests for ascending and descending lists
            // Use Promise.all to fetch both lists in parallel
            const [ascResponse, descResponse] = await Promise.all([
                fetchCarlistData('asc').catch(e => {
                    console.error('Carlist Ascending Error:', e)
                    return []
                }),
                fetchCarlistData('desc').catch(e => {
                    console.error('Carlist Descending Error:', e)
                    return []
                })
            ])

            // Deduplicate using a combination of fields as unique identifier
            // listingsMap will store the unique listings
            const listingsMap: Record<string, any> = {}

            // Helper function to help normalize listing data
            const processListing = (listing: any) => {
                const normalized = {
                    ...listing,
                    price: listing['offers.price'] || listing.price,
                    image: listing['image[0].url'] || listing.image,
                    url: listing['mainEntityOfPage'] || listing.url
                }
                // Create a unique key for each listing
                const key = `${normalized['brand.name']}-${normalized['model']}-${normalized.price}-${normalized['vehicleModelDate']}`
                listingsMap[key] = normalized
            }

            // Add ascending listings
            ascResponse.forEach(processListing)
            // Add descending listings
            descResponse.forEach(processListing)

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
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Carlist'
            }

        } catch (e: any) {
            // Log the error
            // console.error('Error fetching Carlist data:', e)
            console.log('Error fetching Carlist data:', e)
            return {
                // Return empty arrays to prevent the app from crashing
                listings: [],
                listingsAscending: [],
                listingsDescending: [],
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Carlist'
            }
        }
    }

    // Function to retrieve Mudah listings
    const getMudahData = async () => {
        if (!canSubmit) return

        // Validate if make exists in Mudah
        if (!makeExistsInMudah) {
            console.log("Make does not exist in Mudah")
            return {
                listings: [],
                listingsAscending: [],
                listingsDescending: [],
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Mudah',
                unavailable: true
            }
        }

        // Validate if model exists in Mudah
        if (!modelExistsInMudah) {
            console.log("Model does not exist in Mudah")
            return {
                listings: [],
                listingsAscending: [],
                listingsDescending: [],
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Mudah',
                unavailable: true  // Optional flag to indicate platform doesn't support this model
            }
        }

        try {
            // Get the make and model slugs
            const makeSlug = slug(make)
            const modelSlug = slug(model)
            const headers = { "Content-Type": "application/json" }

            // Helper function used to fetch listings
            const fetchListings = async (sortOrder: 'price_asc' | 'price_desc') => {
                console.log("Make exists for Mudah. Make: ", make)
                console.log('Fetching Mudah data', sortOrder)
                // Base search query
                const searchQuery: Record<string, any> = {
                    make_id: makeSlug,
                    model_id: modelSlug,
                    From: fromOffset,
                    limit,
                    sortby: sortOrder,
                    type
                }

                // Model year (with range)
                const yearQuery = (() => {
                    const from = yearFrom || ""
                    if (!from) return ""
                    if (from) return `${from}-${from}`
                    return `${MIN_VALUES.year}-`
                })()
                if (yearQuery) searchQuery.mfg_year = yearQuery

                // Fuel type
                if (fuelType) searchQuery.fueltype = fuelType

                // Body type
                if (bodyType) {
                    const mudahBodyMap: Record<string, string> = {
                        'sedan': 'sedan',
                        'hatchback': 'hatchback',
                        'suv': 'suvs',
                        'mpv': 'mpvs',
                        'coupe': 'coupe',
                        'pickup': 'pick_up',
                        'convertible': 'sports',
                        'wagon': 'other',
                        'van': 'other'
                    }
                    const mapped = mudahBodyMap[bodyType]
                    if (mapped) searchQuery.car_type_id = mapped
                }

                // Mileage query with 5000 KM window
                const mileageQuery = (() => {
                    const from = mileageFrom || ""
                    if (!from) return ""

                    const fromNum = parseInt(from, 10)
                    if (Number.isNaN(fromNum)) return ""

                    const toNum = fromNum + 5000
                    return `${from}-${toNum}`
                })()
                if (mileageQuery) searchQuery.mileage = mileageQuery

                // Transmission
                if (transmission) searchQuery.transmission_id = transmission

                // After query is built, fetch listings 
                const response = await fetch(`/api/mudah/search`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ searchQuery })
                })

                // If response is not ok, throw error
                if (!response.ok) {
                    const errorText = await response.text()
                    console.log('Failed to fetch Mudah Listings:', response.status, errorText)
                    return []
                    // throw new Error(`Failed to fetch Mudah Listings: ${response.status} - ${errorText}`)
                }
                return await response.json()
            }

            // Now fetch both ascending and descending order listings
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

            // Create a map using adview_url as the key to deduplicate
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
                source: 'Mudah'
            }

        } catch (e: any) {
            console.log('Error fetching Mudah data:', e)
            // throw new Error(e?.message || "Something went wrong with Mudah")
            // Return empty arrays to prevent the app from crashing
            return {
                listings: [],
                listingsAscending: [],
                listingsDescending: [],
                make: make,
                model: model,
                vehicleType: 'car',
                source: 'Mudah'
            }
        }
    }

    const handleSubmit = async () => {
        if (!canSubmit) return

        setIsLoading(true)
        if (onSearchStart) {
            onSearchStart()
        }

        try {
            // Initialize results and errors arrays
            const results: any[] = []
            const errors: string[] = []

            // Fetch from all sources
            // Try to fetch from Mudah
            try {
                const mudahResult = await getMudahData()
                // Validate if listings is not undefined
                if (mudahResult && mudahResult.listings !== undefined) {
                    results.push(mudahResult)
                }
            } catch (e: any) {
                // errors.push(`Mudah: ${e?.message || "Unknown error"}`)
                console.log('Error fetching Mudah data:', e)
            }

            // Try to fetch from Carlist
            try {
                const carlistResult = await getCarlistData()
                if (carlistResult && carlistResult.listings !== undefined) {
                    results.push(carlistResult)
                }
            } catch (e: any) {
                // errors.push(`Carlist: ${e?.message || "Unknown error"}`)
                console.log('Error fetching Carlist data:', e)
            }

            // Construct all of the user inputs object from state
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

            // If no results from any source, return error
            if (results.length === 0) {
                onSearch({ error: errors.join('; ') || "No results from source" })
                return
            }

            // Combine and return results
            if (results.length === 1) {
                // if only one source is available, return the result from that source
                const result = results[0]
                onSearch({
                    ...result,
                    userInputs: currentUserInputs,
                    counts: {
                        [result.source.toLowerCase()]: result.listings.length,
                        total: result.listings.length
                    }
                })
            } else {
                // Else, combine results from both sources
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
            // onSearch({ error: e?.message || "Something went wrong" })
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="rounded-2xl md:rounded-3xl border border-foreground/40 shadow-sm p-4 md:p-6 bg-brand-white">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-1 pb-3 border-b-2 border-brand/20">
                    <h3 className="text-lg font-bold text-brand">Car Make/Model</h3>
                    <p className="text-xs text-foreground">Select the make and model of the vehicle and also the region</p>
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
                        />
                    </div>
                </div>
                {/* Option to change between East and West Malaysia */}
                <div className="flex flex-col gap-2 border-b-2 border-brand/20 pb-4">
                    <p className="text-brand font-medium">*Region</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="west"
                                name="region"
                                value="west"
                                checked={region === 'west'}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-4 h-4 accent-brand"
                                disabled={fieldsDisabled}
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
                                disabled={fieldsDisabled}
                            />
                            <label htmlFor="east">East Malaysia</label>
                        </div>

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
                                    { value: "sedan", label: "Sedan" },
                                    { value: "hatchback", label: "Hatchback" },
                                    { value: "suv", label: "SUV" },
                                    { value: "mpv", label: "MPV" },
                                    { value: "coupe", label: "Coupe" },
                                    { value: "pickup", label: "Pick-up" },
                                    { value: "convertible", label: "Convertible" },
                                    { value: "wagon", label: "Wagon" },
                                    { value: "van", label: "Van" },
                                ]}
                            />
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
                            <FormSelect
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "New Local", label: "New Local" },
                                    { value: "New Import", label: "New Import" },
                                    { value: "Used Local", label: "Used Local" },
                                    { value: "Used Import", label: "Used Import" },
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
                                    { value: "auto", label: "Automatic" },
                                    { value: "manual", label: "Manual" },
                                ]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">*Fuel Type</label>
                            <FormSelect
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                disabled={fieldsDisabled}
                                options={[
                                    { value: "petrol", label: "Petrol" },
                                    { value: "diesel", label: "Diesel" },
                                    { value: "hybrid", label: "Hybrid" },
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
                                options={engineCapacityOptionsLiters}
                                labelFormatter={formatEngineCapacity}
                            />
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
                                options={mileageOptions}
                                labelFormatter={formatMileage}
                            />
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
                            // href="#valuation"
                            onClick={() => {
                                handleSubmit()
                                // Small delay to allow react to render the results wrapper or start loading
                                setTimeout(() => scrollToElement("valuation"), 100)
                            }}
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
        </div>
    )
}