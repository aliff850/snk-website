import { Car, ArrowUpDown, Grid3x3, List, CircleDollarSign } from 'lucide-react'
// import { Button } from '../../ui/button'
import { useState, useMemo, useEffect, useRef } from 'react'
import ListView from './ListView'
import GridListView from './GridListView'
import UserInputsDisplay from '../shared/UserInputsDisplay'

interface MudahListing {
    model_name: string
    make_name: string
    condition_name: string
    manufactured_year: string
    fueltype: string
    price: number
    mileage: {
        gte: string
        lte: string
    }
    transmission_name: string
    engine_capacity: string
    car_type_name: string
    adview_url: string
    image: string
    variant?: string
}

interface MudahListingsDisplayProps {
    listings: MudahListing[]
    listingsAscending?: MudahListing[]
    listingsDescending?: MudahListing[]
    userInputs?: {
        make: string
        model: string
        year?: string
        bodyType?: string
        engineCapacity?: string
        fuelType?: string
        transmission?: string
        origin?: string
        mileage?: string
        insuredPrice?: string
    }
}

export default function MudahListingsDisplay({ 
    listings = [], 
    listingsAscending = [],
    listingsDescending = [],
    userInputs
}: MudahListingsDisplayProps) {
    
    const [removedUrls, setRemovedUrls] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<'ascending' | 'descending'>('ascending')
    const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid')
    const [isFloating, setIsFloating] = useState(false)
    const [shouldShowFloating, setShouldShowFloating] = useState(false)
    const priceContainerRef = useRef<HTMLDivElement>(null)

    // Update filtered listings when view mode changes
    const displayListings = useMemo(() => {
        let source: MudahListing[]
        
        if (listingsAscending.length > 0 && listingsDescending.length > 0) {
            source = viewMode === 'ascending' ? listingsAscending : listingsDescending
        } else {
            source = listings
        }
        // Filter out removed listings using adview_url
        return source.filter(listing => !removedUrls.has(listing.adview_url))
    }, [viewMode, listingsAscending, listingsDescending, listings, removedUrls])

    const removeListing = (adviewUrl: string) => {
        setRemovedUrls(prev => new Set(prev).add(adviewUrl))
    }

    // Scroll detection for floating price container with smooth animations
    useEffect(() => {
        const handleScroll = () => {
            if (priceContainerRef.current) {
                const rect = priceContainerRef.current.getBoundingClientRect()
                const shouldFloat = rect.top < 0
                
                if (shouldFloat !== isFloating) {
                    setIsFloating(shouldFloat)
                    
                    if (shouldFloat) {
                        // Show floating container immediately when scrolling down
                        setShouldShowFloating(true)
                    } else {
                        // Hide floating container with delay when scrolling up
                        setTimeout(() => {
                            setShouldShowFloating(false)
                        }, 300) // Match the duration of the exit animation
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

    const formatMileage = (mileage: { gte: string; lte: string }) => {
        const gte = parseInt(mileage.gte).toLocaleString()
        const lte = parseInt(mileage.lte).toLocaleString()
        return `${gte} - ${lte} km`
    }

    if (!displayListings || displayListings.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No listings found</p>
            </div>
        )
    }

    // Calculating all the price statistics
    // Calculate base average from listings
    const prices = displayListings.map(l => l.price)
    const condition_name = userInputs?.origin
    const lowPercentage = 0.1
    const highPercentage = 0.2
    const baseAveragePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)

    // Apply condition adjustment to get adjusted average
    let averagePrice = baseAveragePrice
    if (condition_name === "Very Poor") { averagePrice = Math.round(baseAveragePrice * (1 - highPercentage)) } 
    else if (condition_name === "Poor") { averagePrice = Math.round(baseAveragePrice * (1 - lowPercentage)) }
    else if (condition_name === "Good") { averagePrice = Math.round(baseAveragePrice * (1 + lowPercentage)) } 
    else if (condition_name === "Very Good") { averagePrice = Math.round(baseAveragePrice * (1 + highPercentage)) }

    // Calculate range based on adjusted average (maintain ±10% range)
    const rangePercentage = 0.1
    const lowestPrice = Math.round(averagePrice * (1 - rangePercentage))
    const highestPrice = Math.round(averagePrice * (1 + rangePercentage))

    // Price summary component
    const PriceSummary = ({ className = "" }: { className?: string }) => (
           
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
            <div className="rounded-xl flex justify-between sm:items-center md:flex-col bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-2 md:p-4">
                <p className="text-sm font-medium text-green-700">Lowest Price</p>
                <p className="md:text-4xl font-bold text-green-900">{formatPrice(lowestPrice)}</p>
            </div>
            
            <div className="rounded-xl flex justify-between sm:items-center md:flex-col bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-2 md:p-4">
                <p className="text-sm font-medium text-blue-700">Average Price</p>
                <p className="md:text-4xl font-bold text-blue-900">{formatPrice(averagePrice)}</p>
            </div>
            
            <div className="rounded-xl flex justify-between sm:items-center md:flex-col bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-2 md:p-4">
                <p className="text-sm font-medium text-purple-700">Highest Price</p>
                <p className="md:text-4xl font-bold text-purple-900">{formatPrice(highestPrice)}</p>
            </div>
        </div>

    )

    return (
        <div className="flex flex-col gap-4">

            {/* Container which displays user vehicle details */}
            {userInputs && (
                <UserInputsDisplay 
                    make={userInputs.make}
                    model={userInputs.model}
                    year={userInputs.year}
                    bodyType={userInputs.bodyType}
                    engineCapacity={userInputs.engineCapacity}
                    fuelType={userInputs.fuelType}
                    transmission={userInputs.transmission}
                    origin={userInputs.origin}
                    mileage={userInputs.mileage}
                    insuredPrice={userInputs.insuredPrice}
                />
            )}
            
            {/* Floating price container */}
            {shouldShowFloating && (
                <div className={`hidden md:block fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 transition-all duration-300 ease-out ${
                    isFloating 
                        ? 'animate-in slide-in-from-top-4 fade-in' 
                        : 'animate-out slide-out-to-top-4 fade-out'
                }`}>
                    <div className="bg-brand-white rounded-3xl p-4 shadow-2xl border border-foreground/40 backdrop-blur-sm">
                        <PriceSummary className="mb-0" />
                    </div>
                </div>
            )}
            
            {/* Container to display all prices and average */}
            <div ref={priceContainerRef} className="rounded-xl border border-foreground/20 flex flex-col p-2 md:p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-green-100">
                        <CircleDollarSign className="w-5 h-5 text-green-900" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">Estimated Market Value</h3>
                </div>
                <PriceSummary />
            </div>

            {/* Controls Section - Price Sorting and Display Mode Toggle */}
            <div className="rounded-xl border border-foreground/20 p-2 md:p-4 flex flex-col gap-4">

            <div className="flex flex-col gap-4">
                {/* Price Sorting */}
                {listingsAscending.length > 0 && listingsDescending.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">View:</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('ascending')}
                                className={`p-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium transition-colors ${
                                    viewMode === 'ascending'
                                        ? 'bg-brand text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Price: Low to High 
                                {/* ({listingsAscending.length}) */}
                            </button>
                            <button
                                onClick={() => setViewMode('descending')}
                                className={`p-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium transition-colors ${
                                    viewMode === 'descending'
                                        ? 'bg-brand text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Price: High to Low 
                                {/* ({listingsDescending.length}) */}
                            </button>
                        </div>
                    </div>
                )}

                {/* Toggle for ascending and descending */}
                <div className="flex items-center justify-between">

                    {/* Title text for listings */}
                    <div className="flex flex-col text-center md:text-left">
                        <h6 className="font-semibold text-xl md:text-2xl">
                            {listingsAscending.length > 0 && listingsDescending.length > 0 ? (
                                viewMode === 'ascending' 
                                    ? `Showing ${listingsAscending.length} Lowest Price Listings`
                                    : `Showing ${listingsDescending.length} Highest Price Listings`
                            ) : (
                                `Found ${displayListings.length} ${displayListings.length === 1 ? 'listing' : 'listings'}`
                            )}
                        </h6>
                        <p className="text-xs text-foreground/80">Please double check the listings to ensure there are no discrepancies</p>
                    </div>

                    {/* Toggle for display mode */}
                    <div className="hidden md:flex gap-2 items-center">
                        <button
                            onClick={() => setDisplayMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                displayMode === 'grid'
                                    ? 'bg-brand text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-label="Grid view"
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDisplayMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                displayMode === 'list'
                                    ? 'bg-brand text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-label="List view"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
            
            {/* Listings Display - switch between grid or list */}
            {displayMode === 'list' ? (
                <ListView 
                    listings={displayListings}
                    onRemove={removeListing}
                />
            ) : (
                <GridListView 
                    listings={displayListings}
                    onRemove={removeListing}
                />
            )}
            </div>
        </div>
    )
}