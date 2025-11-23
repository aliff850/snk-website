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

interface GridListViewProps {
    listings: MudahListing[]
    onRemove: (adviewUrl: string) => void
}

const formatPrice = (price: number) => {
    return `RM ${price.toLocaleString()}`
}

const formatMileage = (mileage: { gte: string; lte: string }) => {
    const gte = parseInt(mileage.gte).toLocaleString()
    const lte = parseInt(mileage.lte).toLocaleString()
    return `${gte} - ${lte} km`
}

export default function GridListView({ listings, onRemove }: GridListViewProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {listings.map((listing) => (
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

                                <button onClick={() => onRemove(listing.adview_url)} className="hover:text-red-500 transition-colors">
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
    )
}

