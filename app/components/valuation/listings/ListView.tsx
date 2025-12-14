import { ExternalLink, Calendar, Gauge, Fuel, Settings, Trash2 } from 'lucide-react'

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

interface MudahListingsListViewProps {
    listings: MudahListing[]
    onRemove: (adviewUrl: string) => void
    vehicleType?: 'car' | 'motorcycle'
}

export default function ListView({ 
    listings,
    onRemove
}: MudahListingsListViewProps) {
    
    const formatPrice = (price: number) => {
        return `RM ${price.toLocaleString()}`
    }

    const formatMileage = (mileage: { gte: string; lte: string }) => {
        const gte = parseInt(mileage.gte).toLocaleString()
        const lte = parseInt(mileage.lte).toLocaleString()
        return `${gte} - ${lte} km`
    }

    return (
        <div className="space-y-3">
            {listings.map((listing) => (
                <div 
                    key={listing.adview_url}
                    className="rounded-xl border border-foreground/20 bg-brand-white hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                    <div className="flex flex-col sm:flex-row sm:h-44">
                        {/* Image Section */}
                        <div className="sm:w-64 flex-shrink-0 bg-gray-100 h-48 sm:h-full">
                            {listing.image ? (
                                <img 
                                    src={listing.image} 
                                    alt={`${listing.make_name} ${listing.model_name}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E'
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 p-4 flex flex-col">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 md:flex md:items-center md:gap-2 min-w-0">
                                    <h3 className="font-bold text-lg truncate">
                                        {listing.make_name} {listing.model_name}
                                    </h3>
                                    
                                    {listing.variant && (
                                        <p className="text-sm text-gray-600 mt-0.5 truncate">
                                            {listing.variant}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center mt-2 md:mt-0 gap-2 flex-wrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            listing.condition_name === 'New' 
                                                ? 'bg-green-100 text-green-800' 
                                                : listing.condition_name === 'Used'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {listing.condition_name}
                                        </span>
                                        <span className="text-xs text-gray-500">{listing.car_type_name}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <div className="text-xl md:text-2xl font-bold text-brand whitespace-nowrap">
                                        {formatPrice(listing.price)}
                                    </div>
                                    <button 
                                        onClick={() => onRemove(listing.adview_url)} 
                                        className="hover:text-red-500 transition-colors flex-shrink-0"
                                        aria-label="Remove listing"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 mt-auto pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Year</p>
                                        <p className="text-sm font-medium text-gray-900">{listing.manufactured_year}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Mileage</p>
                                        <p className="text-sm font-medium text-gray-900 truncate">{formatMileage(listing.mileage)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Transmission</p>
                                        <p className="text-sm font-medium text-gray-900 truncate">{listing.transmission_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Fuel className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">Fuel / Engine</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize truncate">
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
                                className="mt-3 w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 px-4 py-2 bg-brand/90 hover:bg-brand text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                View Listing
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}