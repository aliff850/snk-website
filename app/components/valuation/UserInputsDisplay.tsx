import { Car, Calendar, Gauge, Fuel, Settings, Cog, } from 'lucide-react'

interface UserInputsDisplayProps {
    make: string
    model: string
    year?: string
    bodyType?: string
    engineCapacity?: string
    fuelType?: string
    transmission?: string
    origin?: string
    mileage?: string
}

export default function UserInputsDisplay({
    make,
    model,
    year,
    bodyType,
    engineCapacity,
    fuelType,
    transmission,
    origin,
    mileage
}: UserInputsDisplayProps) {
    
    // Format the display values
    const formatValue = (value: string | undefined, fallback: string = 'Not specified') => {
        if (!value) return fallback
        return value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const formatMileage = (value: string | undefined) => {
        if (!value) return 'Not specified'
        const num = parseInt(value, 10)
        if (isNaN(num)) return 'Not specified'
        return `${num.toLocaleString()} km`
    }

    return (
        <div className="rounded-xl border border-foreground/20 bg-brand/5 p-2 md:p-4">

            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-brand/10">
                    <Car className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground">Your Vehicle Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {/* Vehicle Identity */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Vehicle Make and Model</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                        {formatValue(make)} {formatValue(model)}
                    </p>
                </div>

                {/* Year */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Year</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                        {year ? year : "--"}
                    </p>
                </div>

                {/* Body Type */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Body Type</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                        {bodyType ? formatValue(bodyType) : "--"}
                    </p>
                </div>

                {/* Engine Capacity */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Cog className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Engine Capacity</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                        {engineCapacity ? `${engineCapacity}L` : "--"}
                    </p>
                </div>

                {/* Fuel Type */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Fuel className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Fuel Type</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900 capitalize">
                        {fuelType ? formatValue(fuelType) : "--"}
                    </p>
                </div>

                {/* Transmission */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Transmission</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900 capitalize">
                        {transmission ? formatValue(transmission) : "--"}
                    </p>
                </div>

                {/* Origin */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Origin</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900 capitalize">
                        {origin ? formatValue(origin) : "--"}
                    </p>
                </div>

                {/* Mileage */}
                <div className="bg-brand-white rounded-lg p-3 border border-foreground/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">Mileage (KM)</p>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                        {mileage ? formatMileage(mileage) : "--"}
                    </p>
                </div>
            </div>
        </div>
    )
}