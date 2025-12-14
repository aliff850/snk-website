// For displaying all Mudah and Carlist listings
import { ExternalLink, Calendar, Gauge, Fuel, Settings, Trash2, Car } from 'lucide-react'

interface UnifiedListing {
    source: 'Mudah' | 'Carlist'
    make: string
    model: string
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
}

interface UnifiedListViewProps {
    listings: UnifiedListing[]
    onRemove: (url: string) => void
    vehicleType?: 'car' | 'motorcycle'
}

const formatPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`
}

const formatMileage = (mileage: string | { gte: string; lte: string } | undefined) => {
    if (!mileage) return 'N/A'
    
    if (typeof mileage === 'string') {
        return mileage
    }
    
    const gte = parseInt(mileage.gte).toLocaleString()
    const lte = parseInt(mileage.lte).toLocaleString()
    return `${gte} - ${lte} km`
}

export default function UnifiedListView({ listings, onRemove, vehicleType = 'car' }: UnifiedListViewProps) {
    return (
        <div className="flex flex-col gap-3">
            {listings.map((listing, index) => (
                <div 
                    key={`${listing.url}-${index}`}
                    className="rounded-xl border border-foreground/20 bg-brand-white hover:shadow-md transition-shadow duration-200"
                >
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                        {/* Image */}
                        {listing.image ? (
                            <div className="w-full md:w-48 h-48 md:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                    src={listing.image} 
                                    alt={`${listing.make} ${listing.model}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E'
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-full md:w-48 h-48 md:h-32 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Car className="w-12 h-12 text-gray-400" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        <h3 className="font-bold text-lg">
                                            {listing.make} {listing.model}
                                        </h3>
                                        {/* Source badge */}
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                                            listing.source === 'Mudah'
                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                                        }`}>
                                            {listing.source}
                                        </span>
                                    </div>
                                    
                                    {listing.variant && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {listing.variant}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        {listing.condition && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                listing.condition === 'New' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : listing.condition === 'Used'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {listing.condition}
                                            </span>
                                        )}
                                        {vehicleType === 'car' && listing.bodyType && (
                                            <span className="text-xs text-gray-500 capitalize">{listing.bodyType}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Price and Remove button */}
                                <div className="flex items-start gap-2 ml-4">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-brand">
                                            {formatPrice(listing.price)}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onRemove(listing.url)} 
                                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                        aria-label="Remove listing"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-auto pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Year</p>
                                        <p className="text-sm font-medium text-gray-900">{listing.year}</p>
                                    </div>
                                </div>

                                {listing.mileage && (
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Mileage</p>
                                            <p className="text-sm font-medium text-gray-900">{formatMileage(listing.mileage)}</p>
                                        </div>
                                    </div>
                                )}

                                {vehicleType === 'car' && listing.transmission && (
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Transmission</p>
                                            <p className="text-sm font-medium text-gray-900">{listing.transmission}</p>
                                        </div>
                                    </div>
                                )}

                                {(listing.fuelType || listing.engineCapacity) && (
                                    <div className="flex items-center gap-2">
                                        <Fuel className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {vehicleType === 'motorcycle' ? 'Engine' : 'Fuel / Engine'}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">
                                                {vehicleType === 'motorcycle' 
                                                    ? listing.engineCapacity ? `${listing.engineCapacity}cc` : 'N/A'
                                                    : listing.fuelType && listing.engineCapacity
                                                        ? `${listing.fuelType} / ${listing.engineCapacity}cc`
                                                        : listing.fuelType || (listing.engineCapacity ? `${listing.engineCapacity}cc` : 'N/A')
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* View Listing Button */}
                            <a
                                href={listing.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 w-full md:w-auto md:self-start flex items-center justify-center gap-2 px-4 py-2 bg-brand/90 hover:bg-brand text-white font-medium rounded-lg transition-colors duration-200"
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