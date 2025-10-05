import { ExternalLink, Calendar, Gauge, Fuel, Settings, Car, Trash2, ArrowUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { useState, useMemo, useEffect, useRef } from 'react'

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
}

export default function MudahListingsDisplay({ 
    listings = [], 
    listingsAscending = [],
    listingsDescending = []
}: MudahListingsDisplayProps) {
    
    const [removedUrls, setRemovedUrls] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<'ascending' | 'descending'>('ascending')
    const [isFloating, setIsFloating] = useState(false)
    const [shouldShowFloating, setShouldShowFloating] = useState(false)
    const priceContainerRef = useRef<HTMLDivElement>(null)
    // const [filteredListings, setFilteredListings] = useState<MudahListing[]>(listings)
    //const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none')

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

    // const sortListings = (order: 'asc' | 'desc' | 'none') => {
    //     setSortOrder(order)
    //     if (order === 'none') {
    //         setFilteredListings(listings)
    //     } else {
    //         const sorted = [...filteredListings].sort((a, b) => {
    //             return order === 'asc' ? a.price - b.price : b.price - a.price
    //         })
    //         setFilteredListings(sorted)
    //     }
    // }

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

    // if (!listings || listings.length === 0) {
    //     return (
    //         <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
    //             <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
    //             <p className="text-gray-500">No listings found</p>
    //         </div>
    //     )
    // }

    // calculating all the price statistics
    const prices = displayListings.map(l => l.price)
    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)
    const averagePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)

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
        <div className="space-y-4">
            
            {listingsAscending.length > 0 && listingsDescending.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
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
                            Price: Low to High ({listingsAscending.length})
                        </button>
                        <button
                            onClick={() => setViewMode('descending')}
                            className={`p-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium transition-colors ${
                                viewMode === 'descending'
                                    ? 'bg-brand text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Price: High to Low ({listingsDescending.length})
                        </button>
                    </div>
                </div>
            )}

            {/* Floating price container */}
            {shouldShowFloating && (
                <div className={`hidden md:block fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 transition-all duration-300 ease-out ${
                    isFloating 
                        ? 'animate-in slide-in-from-top-4 fade-in' 
                        : 'animate-out slide-out-to-top-4 fade-out'
                }`}>
                    <div className="bg-brand-white rounded-3xl p-4 shadow-2xl border border-gray-100 backdrop-blur-sm">
                        <PriceSummary className="mb-0" />
                    </div>
                </div>
            )}
            {/* Header section */}
            <div className="flex flex-col mb-4">
                <h6 className="font-semibold text-2xl">
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
            
            {/* Container to display all prices and average */}
            <div ref={priceContainerRef} className="mb-6">
                <PriceSummary />
            </div>


            {/* Sort by price dropdown -- CHANGE THIS SO THAT IT SWITCHES BETWEEN THE TWO DIFFERENT SETS OF LISTINGS (one ascending and one descending) */}

            {/* <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Sort by price:</span>
                </div>
                <select 
                    value={sortOrder}
                    onChange={(e) => sortListings(e.target.value as 'asc' | 'desc' | 'none')}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors"
                >
                    <option value="none">Original order</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div> */}

            {/* Options to switch between different listing views */}

            
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayListings.map((listing) => (
                <div 
                    key={listing.adview_url}
                    className="rounded-xl border border-foreground/20 bg-brand-white hover:shadow-md transition-shadow duration-200"
                >
                    <div className="p-4 md:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">

                            <h3 className="font-bold text-lg">
                                {listing.make_name} {listing.model_name}
                            </h3>

                            {listing.variant && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {listing.variant}
                                </p>
                            )}

                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                listing.condition_name === 'New' 
                                    ? 'bg-green-100 text-green-800' 
                                    : listing.condition_name === 'Used'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                {listing.condition_name}
                                </span>
                                <span className="text-xs md:text-sm text-gray-500">{listing.car_type_name}</span>
                            </div>

                        </div>

                        <div className="text-right flex gap-2">
                            <div className="text-xl md:text-2xl font-bold text-brand">
                                {formatPrice(listing.price)}
                            </div>

                            <button onClick={() => removeListing(listing.adview_url)} className="hover:text-red-500 transition-colors">
                                <Trash2 className="w-6 h-6" />
                            </button>

                        </div>
                    </div>
                    
                    {listing.image && (
                        <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                                src={listing.image} 
                                alt={`${listing.make_name} ${listing.model_name}`}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    // fallback if image fails to load
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E'
                                }}
                            />
                        </div>
                    )}

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Year</p>
                            <p className="text-sm font-medium text-gray-900">{listing.manufactured_year}</p>
                        </div>
                        </div>

                        <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Mileage</p>
                            <p className="text-sm font-medium text-gray-900">{formatMileage(listing.mileage)}</p>
                        </div>
                        </div>

                        <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Transmission</p>
                            <p className="text-sm font-medium text-gray-900">{listing.transmission_name}</p>
                        </div>
                        </div>

                        <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Fuel / Engine</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                            {listing.fueltype} / {listing.engine_capacity}cc
                            </p>
                        </div>
                        </div>
                    </div>

                    {/* View Listing Button */}
                    <a
                        href={listing.adview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand/90 hover:bg-brand text-white font-medium rounded-xl transition-colors duration-200"
                    >
                        View Listing
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}