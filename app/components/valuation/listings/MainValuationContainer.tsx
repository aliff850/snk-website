// Container to display listings from both Mudah and Carlist

import { Car, CircleDollarSign, HandCoins, ArrowUp, ArrowDown } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import UnifiedGridView from './ValuationListings'
import UserInputsDisplay from '../shared/UserInputsDisplay'
import { useAuth } from '@/context/AuthContext'

export function SortButton({
    mode,
    viewMode,
    setViewMode,
    icon,
    text
}: {
    mode: 'ascending' | 'descending',
    viewMode: 'ascending' | 'descending',
    setViewMode: (viewMode: 'ascending' | 'descending') => void,
    icon: React.ReactNode,
    text: string
}) {
    const isActive = viewMode === mode;
    return (
        <button
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-2 p-2 text-sm md:px-4 md:py-2 md:text-base rounded-full font-medium transition-ring-color duration-200 ease-in-out ${isActive
                ? 'bg-brand text-brand-white'
                : 'ring-1 ring-brand-light-grey/50 hover:ring-brand-light-grey bg-gray-100 text-brand-grey hover:bg-gray-200'
                }`}
        >
            {icon}
            {text}
        </button>
    )
}

export function PriceContainer({
    title,
    price,
    color,
    //formatPrice
}: {
    title: string,
    price: string,
    color: 'lowest' | 'highest' | 'average',
    //formatPrice: (price: number) => string
}) {
    return (
        <div className={`rounded-xl md:rounded-2xl flex justify-between sm:items-center md:flex-col print:flex-col bg-gradient-to-br ${color === 'lowest' ? 'from-green-50 to-green-100 border border-green-200' : color === 'highest' ? 'from-purple-50 to-purple-100 border border-purple-200' : 'from-blue-50 to-blue-100 border border-blue-200'} p-2 md:p-4`}>
            <p className={`text-sm font-medium ${color === 'lowest' ? 'text-green-700' : color === 'highest' ? 'text-purple-700' : 'text-blue-700'}`}>{title}</p>
            <p className={`print:text-3xl md:text-4xl font-bold ${color === 'lowest' ? 'text-green-900' : color === 'highest' ? 'text-purple-900' : 'text-blue-900'}`}>{price}</p>
        </div>
    )
}

// Works for both Mudah and Carlist
interface UnifiedListing {
    // Common fields
    source: 'Mudah' | 'Carlist'
    make: string
    model: string
    region?: string
    variant?: string
    year: string | number
    price: number
    mileage?: string | { gte: string; lte: string }
    transmission?: string
    fuelType?: string
    condition?: string
    bodyType?: string
    engineCapacity?: string
    image?: string
    url: string

    // Original data for fallback
    originalData?: any
}

interface UnifiedListingsDisplayProps {
    listings: any[]
    listingsAscending?: any[]
    listingsDescending?: any[]
    vehicleType?: 'car' | 'motorcycle'
    source?: string
    counts?: {
        mudah?: number
        carlist?: number
        total?: number
        duplicatesRemoved?: number
    }
    userInputs?: {
        make: string
        model: string
        region?: string
        year?: string
        fuelType?: string
        transmission?: string
        origin?: string
        condition?: string
        mileage?: string
        insuredPrice?: string
        variant?: string
        style?: string
        cc?: string
        electricMotorWatts?: string
    }
}

// Normalize listing from either source
const normalizeListing = (listing: any): UnifiedListing | null => {

    // Safety check to see if listing is valid
    // If listing is not an object, return null
    if (!listing || typeof listing !== 'object') {
        console.warn("Invalid listing object:", listing)
        return null
    }
    // Check if it's a Mudah listing (has adview_url)
    if (listing.adview_url || listing.make_name) {
        return {
            source: 'Mudah',
            make: listing.make_name || '',
            model: listing.model_name || '',
            variant: listing.variant,
            year: listing.manufactured_year || '',
            price: listing.price || listing.normalizedPrice || 0,
            mileage: listing.mileage,
            transmission: listing.transmission_name,
            fuelType: listing.fueltype,
            condition: listing.condition_name,
            bodyType: listing.car_type_name,
            engineCapacity: listing.engine_capacity,
            image: listing.image,
            url: listing.adview_url || '',
            originalData: listing
        }
    }
    // Otherwise it's a Carlist listing
    return {
        source: 'Carlist',
        make: listing['brand.name'] || '',
        model: listing.model || '',
        variant: listing.variant,
        year: listing.vehicleModelDate || listing['vehicleModelDate'] || '',
        price: listing['offers.price'] || listing.normalizedPrice || 0,
        mileage: listing['mileageFromOdometer.value'] ? `${listing['mileageFromOdometer.value']} km` : undefined,
        transmission: listing.vehicleTransmission || listing['vehicleTransmission'],
        fuelType: listing.fuelType || listing['fuelType'],
        condition: listing.itemCondition || listing['itemCondition'],
        bodyType: listing.bodyType,
        engineCapacity: listing.engineCapacity,
        image: listing.image,
        url: listing.url || '',
        originalData: listing
    }
}

export default function UnifiedListingsDisplay({
    listings = [],
    listingsAscending = [],
    listingsDescending = [],
    vehicleType = 'car',
    userInputs
}: UnifiedListingsDisplayProps) {

    const [removedUrls, setRemovedUrls] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<'ascending' | 'descending'>('ascending')
    // const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
    const [sourceFilter, setSourceFilter] = useState<'all' | 'mudah' | 'carlist'>('all')
    const [isFloating, setIsFloating] = useState(false)
    const [shouldShowFloating, setShouldShowFloating] = useState(false)
    const priceContainerRef = useRef<HTMLDivElement>(null)

    // Normalize all listings
    const normalizedListings = useMemo(() => {
        return listings.map(normalizeListing).filter((listing): listing is UnifiedListing => listing !== null)
    }, [listings])

    const normalizedAscending = useMemo(() => {
        return listingsAscending.map(normalizeListing).filter((listing): listing is UnifiedListing => listing !== null)
    }, [listingsAscending])

    const normalizedDescending = useMemo(() => {
        return listingsDescending.map(normalizeListing).filter((listing): listing is UnifiedListing => listing !== null)
    }, [listingsDescending])

    // Update filtered listings when view mode or source filter changes
    const displayListings = useMemo(() => {
        let source: UnifiedListing[]

        if (normalizedAscending.length > 0 && normalizedDescending.length > 0) {
            source = viewMode === 'ascending' ? normalizedAscending : normalizedDescending
        } else {
            source = normalizedListings
        }

        // Filter by source
        let filtered = source.filter(listing => !removedUrls.has(listing.url))

        if (sourceFilter !== 'all') {
            filtered = filtered.filter(listing =>
                listing.source.toLowerCase() === sourceFilter
            )
        }

        return filtered
    }, [viewMode, normalizedAscending, normalizedDescending, normalizedListings, removedUrls, sourceFilter])

    const removeListing = (url: string) => {
        setRemovedUrls(prev => new Set(prev).add(url))
    }

    // Count listings by source
    const sourceCounts = useMemo(() => {

        const allListings = viewMode === 'ascending' ? normalizedAscending :
            normalizedDescending.length > 0 ? normalizedDescending :
                normalizedListings

        const mudah = allListings.filter(l => l.source === 'Mudah').length
        const carlist = allListings.filter(l => l.source === 'Carlist').length

        return { mudah, carlist, total: mudah + carlist }
    }, [normalizedListings, normalizedAscending, normalizedDescending, viewMode])

    // Scroll detection for floating price container
    useEffect(() => {
        const handleScroll = () => {
            if (priceContainerRef.current) {
                const rect = priceContainerRef.current.getBoundingClientRect()
                const shouldFloat = rect.top < 0

                if (shouldFloat !== isFloating) {
                    setIsFloating(shouldFloat)

                    if (shouldFloat) {
                        setShouldShowFloating(true)
                    } else {
                        setTimeout(() => {
                            setShouldShowFloating(false)
                        }, 300)
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isFloating])

    const formatPrice = (price: number) => {
        return `RM ${price.toLocaleString()}`
    }

    if (!displayListings || displayListings.length === 0) {
        return (
            <div className="h-svh flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No listings found</p>
            </div>
        )
    }

    // Calculate price statistics
    const prices = displayListings.map(l => l.price)
    const baseAveragePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)

    let averagePrice = baseAveragePrice

    // Adjust average price based on region
    // If East Malaysia, add 5% to the average price
    // If Langkawi, add 10% to the average price
    // If West Malaysia price is same
    if (userInputs?.region === "east") {
        averagePrice = Math.round(baseAveragePrice * 1.05)
    } else if (userInputs?.region === "langkawi") {
        // averagePrice = Math.round(baseAveragePrice * 1.1)
        // Comment this out for now since we do not yet have actual percentage for Langkawi
        averagePrice = baseAveragePrice
    }

    // Adjust average price based on condition
    if (userInputs?.condition) {
        const condition_name = userInputs.condition
        const lowPercentage = 0.1
        const highPercentage = 0.2

        if (condition_name === "Very Poor") { averagePrice = Math.round(averagePrice * (1 - highPercentage)) }
        else if (condition_name === "Poor") { averagePrice = Math.round(averagePrice * (1 - lowPercentage)) }
        else if (condition_name === "Good") { averagePrice = Math.round(averagePrice * (1 + lowPercentage)) }
        else if (condition_name === "Very Good") { averagePrice = Math.round(averagePrice * (1 + highPercentage)) }
    }

    // Calculate range based on adjusted average
    const rangePercentage = 0.1
    const lowestPrice = Math.round(averagePrice * (1 - rangePercentage))
    const highestPrice = Math.round(averagePrice * (1 + rangePercentage))

    // Price summary component
    const PriceSummary = ({ className = "" }: { className?: string }) => (
        <div className={`grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 print:gap-2 gap-2 md:gap-4 ${className}`}>
            <PriceContainer
                title="Lowest Price"
                price={formatPrice(lowestPrice)}
                color="lowest"
            />
            <PriceContainer
                title="Average Price"
                price={formatPrice(averagePrice)}
                color="average"
            />
            <PriceContainer
                title="Highest Price"
                price={formatPrice(highestPrice)}
                color="highest"
            />
        </div>
    )

    // Insurable values component (right now the values are placeholders)
    const InsurableValue = ({ className = "" }: { className?: string }) => {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 print:gap-2 gap-2 md:gap-4 ${className}`}>
                <PriceContainer
                    title="Lowest Insurable Value"
                    price="RM 0"
                    color="lowest"
                />
                <PriceContainer
                    title="Average Insurable Value"
                    price="RM 0"
                    color="average"
                />
                <PriceContainer
                    title="Highest Insurable Value"
                    price="RM 0"
                    color="highest"
                />
            </div>
        )
    }
    const { user } = useAuth();
    return (
        <div className="flex flex-col print:gap-2 gap-4">
            {/* User vehicle details */}
            {userInputs && (
                <UserInputsDisplay
                    make={userInputs.make}
                    model={userInputs.model}
                    year={userInputs.year}
                    region={userInputs.region}
                    vehicleType={vehicleType}
                    fuelType={userInputs.fuelType}
                    transmission={userInputs.transmission}
                    origin={userInputs.origin}
                    condition={userInputs.condition}
                    mileage={userInputs.mileage}
                    insuredPrice={userInputs.insuredPrice}
                    variant={userInputs.variant}
                    style={userInputs.style}
                    cc={userInputs.cc}
                    electricMotorWatts={userInputs.electricMotorWatts}
                />
            )}

            {/* Floating price container */}
            {shouldShowFloating && (
                <div className={`hidden md:block print:hidden fixed top-22 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 transition-all duration-300 ease-out ${isFloating
                    ? 'animate-in slide-in-from-top-4 fade-in'
                    : 'animate-out slide-out-to-top-4 fade-out'
                    }`}>
                    <div className="bg-brand-white rounded-3xl p-4 shadow-2xl border border-brand-light-grey backdrop-blur-sm">
                        <PriceSummary className="mb-0" />
                    </div>
                </div>
            )}

            {/* Insurable values container */}
            <div className="rounded-xl border border-brand-light-grey flex flex-col gap-4 print:gap-2 p-2 print:p-2 md:p-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-100">
                        <HandCoins className="w-5 h-5 text-purple-900" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">Insurable Value</h3>
                </div>
                <InsurableValue />
                <p className="text-xs">Vehicle insurable value is based on SNK's master database.</p>
            </div>

            {/* Market value container */}
            <div ref={priceContainerRef} className="rounded-xl border border-brand-light-grey flex flex-col gap-4 print:gap-2 p-2 print:p-2 md:p-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-100">
                        <CircleDollarSign className="w-5 h-5 text-purple-900" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">Estimated Market Value</h3>
                </div>
                <PriceSummary />
            </div>

            {/* Controls Section */}
            <div className="rounded-xl border border-brand-light-grey p-2 md:p-4 flex flex-col gap-4 print:hidden">
                <div className="flex flex-col gap-4">
                    {/* Price Sorting */}
                    {normalizedAscending.length > 1 && normalizedDescending.length > 1 && (
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">View:</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <SortButton
                                    mode="ascending"
                                    viewMode={viewMode}
                                    setViewMode={setViewMode}
                                    icon={<ArrowUp className="sm:hidden md:block w-4 h-4" />}
                                    text="Price: Low to High"
                                />
                                <SortButton
                                    mode="descending"
                                    viewMode={viewMode}
                                    setViewMode={setViewMode}
                                    icon={<ArrowDown className="sm:hidden md:block w-4 h-4" />}
                                    text="Price: High to Low"
                                />
                            </div>
                        </div>
                    )}

                    {/* Source filter (only show if we have both sources) */}
                    {/* Only show filter if user is admin and we have both sources */}
                    {/* Defaults to all sources */}
                    {user?.role === 'admin' && sourceCounts.mudah > 0 && sourceCounts.carlist > 0 && (
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                            <span className="font-medium text-gray-700">Filter by Source:</span>
                            <div className="flex flex-col md:flex-row gap-2">
                                <button
                                    onClick={() => setSourceFilter('all')}
                                    className={`px-4 py-2 rounded-full font-medium transition-ring-color duration-200 ease-in-out ${sourceFilter === 'all'
                                        ? 'bg-brand text-white'
                                        : 'ring-1 ring-brand-light-grey/50 hover:ring-brand-light-grey bg-gray-100 text-brand-grey hover:bg-gray-200'
                                        }`}
                                >
                                    All ({sourceCounts.total})
                                </button>
                                <button
                                    onClick={() => setSourceFilter('mudah')}
                                    className={`px-4 py-2 rounded-full font-medium transition-ring-color duration-200 ease-in-out ${sourceFilter === 'mudah'
                                        ? 'bg-blue-600 text-white'
                                        : 'ring-1 ring-blue-300 hover:ring-blue-700 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                        }`}
                                >
                                    Mudah ({sourceCounts.mudah})
                                </button>
                                <button
                                    onClick={() => setSourceFilter('carlist')}
                                    className={`px-4 py-2 rounded-full font-medium transition-ring-color duration-200 ease-in-out ${sourceFilter === 'carlist'
                                        ? 'bg-purple-600 text-white'
                                        : 'ring-1 ring-purple-300 hover:ring-purple-700 bg-purple-50 text-purple-700 hover:bg-purple-100'
                                        }`}
                                >
                                    Carlist ({sourceCounts.carlist})
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Title and display mode toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col text-center md:text-left">
                            <h6 className="font-semibold text-xl md:text-2xl">
                                Showing {displayListings.length} {displayListings.length === 1 ? 'listing' : 'listings'}
                                {sourceFilter !== 'all' && ` from ${sourceFilter.charAt(0).toUpperCase() + sourceFilter.slice(1)}`}
                            </h6>
                            <p className="text-xs text-foreground/80">Please double check the listings to ensure there are no discrepancies</p>
                        </div>
                    </div>
                </div>

                {/* All listings display */}
                <UnifiedGridView
                    listings={displayListings}
                    onRemove={removeListing}
                    vehicleType={vehicleType}
                />

            </div>
        </div>
    )
}