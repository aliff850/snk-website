import { ExternalLink, Calendar, Gauge, Fuel, Settings, Car, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'

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
}

interface MudahListingsDisplayProps {
    listings: MudahListing[]
}

export default function MudahListingsDisplay({ listings = [] }: MudahListingsDisplayProps) {
    
    const [filteredListings, setFilteredListings] = useState<MudahListing[]>(listings)

    const removeListing = (index: number) => {
        setFilteredListings(prev => prev.filter((_, i) => i !== index))
    }

    const formatPrice = (price: number) => {
        return `RM ${price.toLocaleString()}`
    }

    const formatMileage = (mileage: { gte: string; lte: string }) => {
        const gte = parseInt(mileage.gte).toLocaleString()
        const lte = parseInt(mileage.lte).toLocaleString()
        return `${gte} - ${lte} km`
    }

    if (!filteredListings || filteredListings.length === 0) {
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
    const prices = listings.map(l => l.price)
    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)
    const averagePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)

    return (
        <div className="space-y-4">

            {/* Container to display all prices and average */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4">
                    <p className="text-sm font-medium text-green-700 mb-1">Lowest Price</p>
                    <p className="text-4xl font-bold text-green-900">{formatPrice(lowestPrice)}</p>
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4">
                    <p className="text-sm font-medium text-blue-700 mb-1">Average Price</p>
                    <p className="text-4xl font-bold text-blue-900">{formatPrice(averagePrice)}</p>
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4">
                    <p className="text-sm font-medium text-purple-700 mb-1">Highest Price</p>
                    <p className="text-4xl font-bold text-purple-900">{formatPrice(highestPrice)}</p>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <h6 className="font-semibold text-xl">
                    Found {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
                {/* Found {listings.length} {listings.length === 1 ? 'listing' : 'listings'} */}
                </h6>
                <p className="text-xs text-foreground/80">Please double check the listings to ensure there are no discrepancies</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredListings.map((listing, index) => (
                <div 
                    key={index}
                    className="rounded-xl border border-foreground/20 bg-brand-white hover:shadow-md transition-shadow duration-200"
                >
                    <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">

                            <h3 className="font-bold text-lg">
                                {listing.make_name} {listing.model_name}
                            </h3>

                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                listing.condition_name === 'New' 
                                    ? 'bg-green-100 text-green-800' 
                                    : listing.condition_name === 'Used'
                                    ? 'bg-brand-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                {listing.condition_name}
                                </span>
                                <span className="text-sm text-gray-500">{listing.car_type_name}</span>
                            </div>

                        </div>

                        <div className="text-right flex gap-2">
                            <div className="text-2xl font-bold text-brand">
                                {formatPrice(listing.price)}
                            </div>

                            <button className="hover:text-red-500 transition-colors">
                                <Trash2 className="w-6 h-6" />
                            </button>

                        </div>
                    </div>
                    
                    {/* Todo: Add image */}

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