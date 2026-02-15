// For displaying all Mudah and Carlist listings
// The listings are displayed in a "grid" card layout
import { useAuth } from '@/context/AuthContext'
import { ExternalLink, Calendar, Gauge, Fuel, Settings, Trash2 } from 'lucide-react'

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

interface UnifiedGridViewProps {
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

// Helper to format condition (from Carlist's schema.org URL to simple text)
const formatCondition = (condition?: string) => {
    if (!condition) return undefined

    // Handle schema.org URLs or similar patterns
    if (condition.includes('UsedCondition')) return 'Used'
    if (condition.includes('NewCondition')) return 'New'

    // Capitalize first letter if it's a simple string
    return condition.charAt(0).toUpperCase() + condition.slice(1)
}

export default function UnifiedGridView({ listings, onRemove, vehicleType = 'car' }: UnifiedGridViewProps) {

    const { user } = useAuth()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {listings.map((listing, index) => {
                const displayCondition = formatCondition(listing.condition)

                return (
                    <div
                        key={`${listing.url}-${index}`}
                        className="rounded-xl md:rounded-2xl border border-brand-light-grey bg-brand-white hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-4 md:p-5">
                            {/* Header */}
                            <div className="flex flex-col gap-2 md:flex-row items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-start gap-2 mb-2">
                                        <h3 className="font-bold text-lg flex-1">
                                            {listing.make} {listing.model}
                                        </h3>
                                        {/* Source badge */}
                                        {/* Only show source badge for admin */}
                                        {user?.role === 'admin' ? (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${listing.source === 'Mudah'
                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                                                }`}>
                                                {listing.source}
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Variant if exists */}
                                    {listing.variant && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {listing.variant}
                                        </p>
                                    )}

                                    {/* Condition and body type */}
                                    <div className="flex items-center gap-2 mt-1">
                                        {displayCondition && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${displayCondition === 'New'
                                                ? 'bg-green-100 text-green-800'
                                                : displayCondition === 'Used'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {displayCondition}
                                            </span>
                                        )}
                                        {vehicleType === 'car' && listing.bodyType && (
                                            <span className="text-xs md:text-sm text-brand-grey capitalize">{listing.bodyType}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right flex justify-between md:justify-end w-full md:w-auto gap-2 md:ml-2">
                                    <div className="text-xl md:text-2xl font-bold text-brand">
                                        {formatPrice(listing.price)}
                                    </div>

                                    <button
                                        onClick={() => onRemove(listing.url)}
                                        className="hover:text-red-500 transition-colors"
                                        aria-label="Remove listing"
                                        onMouseEnter={(e) => e.currentTarget.title = "Remove listing"}
                                        onMouseLeave={(e) => e.currentTarget.title = ""}
                                    >
                                        <Trash2 className="w-7 h-7" />
                                    </button>
                                </div>
                            </div>

                            {/* Only show listing image for registered users with 'admin' role */}
                            {/* And also if the image exists */}
                            {user?.role === 'admin' && listing.image && (
                                <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={listing.image}
                                        alt={`${listing.make} ${listing.model}`}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E'
                                        }}
                                    />
                                </div>
                            )}

                            <hr className="my-4 border-brand-light-grey" />

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-brand-grey" />
                                    <div>
                                        <p className="text-xs text-brand-grey">Year</p>
                                        <p className="text-sm font-medium text-brand-black">{listing.year}</p>
                                    </div>
                                </div>

                                {listing.mileage && (
                                    <div className="flex items-center gap-2">
                                        <Gauge className="w-4 h-4 text-brand-grey" />
                                        <div>
                                            <p className="text-xs text-brand-grey">Mileage</p>
                                            <p className="text-sm font-medium text-brand-black">{formatMileage(listing.mileage)}</p>
                                        </div>
                                    </div>
                                )}

                                {vehicleType === 'car' && listing.transmission && (
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-brand-grey" />
                                        <div>
                                            <p className="text-xs text-brand-grey">Transmission</p>
                                            <p className="text-sm font-medium text-brand-black">{listing.transmission}</p>
                                        </div>
                                    </div>
                                )}

                                {(listing.fuelType || listing.engineCapacity) && (
                                    <div className="flex items-center gap-2">
                                        <Fuel className="w-4 h-4 text-brand-grey" />
                                        <div>
                                            <p className="text-xs text-brand-grey">
                                                {vehicleType === 'motorcycle' ? 'Engine' : 'Fuel / Engine'}
                                            </p>
                                            <p className="text-sm font-medium text-brand-black capitalize">
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
                            {/* Only show this for admins */}
                            {user?.role === 'admin' && (
                                <a
                                    href={listing.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand/90 hover:bg-brand text-white font-medium rounded-full transition-colors duration-200"
                                >
                                    View Listing
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                        </div>
                    </div>
                )
            })}
        </div>
    )
}