// UserInputsDisplay
// Displays all the user inputs for the valuation

import { Car, Calendar, Gauge, Fuel, Settings, Cog, DollarSign, MapPin, Info, Bolt } from 'lucide-react'
import { FaMotorcycle } from 'react-icons/fa6'

// Reusable user inputs box component
export function UserInputsBox({
    icon,
    title,
    value
}: {
    icon: React.ReactNode
    title: string
    value: string
}) {
    return (
        <div className="bg-brand-white rounded-2xl p-3 print:p-2 ring-1 ring-brand/20">
            <div className="flex items-center text-brand-light-grey gap-2 mb-2">
                {icon}
                <p className="text-xs font-medium text-brand-black">{title}</p>
            </div>
            <p className="text-sm md:text-base font-semibold text-brand-black">
                {value}
            </p>
        </div>
    )
}

interface UserInputsDisplayProps {
    make: string
    model: string
    vehicleType?: 'car' | 'motorcycle'
    year?: string
    region?: string
    // bodyType?: string
    // engineCapacity?: string
    fuelType?: string
    transmission?: string
    condition?: string
    origin?: string
    mileage?: string
    insuredPrice?: string
    variant?: string
    style?: string
    cc?: string
}

export default function UserInputsDisplay({
    make,
    model,
    vehicleType = 'car',
    year,
    region,
    // bodyType,
    // engineCapacity,
    fuelType,
    transmission,
    origin,
    condition,
    mileage,
    insuredPrice,
    variant,
    style,
    cc
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

    const formatInsuredPrice = (value: string | undefined) => {
        if (!value) return 'Not specified'
        const num = parseInt(value, 10)
        if (isNaN(num)) return 'Not specified'
        return `RM ${num.toLocaleString()}`
    }

    const formatRegion = (value: string | undefined) => {
        if (!value) return 'Not specified'
        if (value === 'west') return 'West Malaysia'
        if (value === 'east') return 'East Malaysia'
        if (value === 'langkawi') return 'Langkawi'
        // return value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Malaysia"
    }

    // const formatPrice = (value: string | undefined) => {
    //     if (!value) return 'Any'
    //     const num = parseInt(value, 10)
    //     if (isNaN(num)) return 'Any'
    //     return `RM ${num.toLocaleString()}+`
    // }

    const VehicleIcon = vehicleType === 'motorcycle' ? FaMotorcycle : Car

    return (
        <div className="rounded-xl border border-brand-light-grey bg-brand/5 p-2 md:p-4 print:p-2 flex flex-col gap-4 print:gap-2">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand/10">
                    <VehicleIcon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground">
                    Your {vehicleType === 'motorcycle' ? 'Motorcycle' : 'Vehicle'} Details
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2 gap-3 md:gap-4">

                {/* Vehicle Identity */}
                <UserInputsBox
                    icon={<VehicleIcon className="w-4 h-4 text-gray-500" />}
                    title="Make and Model"
                    value={`${formatValue(make)} ${formatValue(model)}`}
                />

                {/* Year */}
                <UserInputsBox
                    icon={<Calendar className="w-4 h-4 text-gray-500" />}
                    title="Year Manufactured"
                    value={year || "--"}
                />

                {/* Region */}
                <UserInputsBox
                    icon={<MapPin className="w-4 h-4 text-gray-500" />}
                    title="Region"
                    value={`${formatRegion(region) || "--"}`}
                />

                {/* Vehicle condition */}
                <UserInputsBox
                    icon={<Car className="w-4 h-4 text-gray-500" />}
                    title="Vehicle Condition"
                    value={condition ? formatValue(condition) : "--"}
                />

                {/* Car-specific fields */}
                {vehicleType === 'car' && (
                    <>
                        {/* Variant (Carlist only) */}
                        <UserInputsBox
                            icon={<Info className="w-4 h-4 text-gray-500" />}
                            title="Variant"
                            value={variant ? formatValue(variant) : "--"}
                        />

                        {/* Body Type */}
                        <UserInputsBox
                            icon={<Car className="w-4 h-4 text-gray-500" />}
                            title="Body Type"
                            value={style ? formatValue(style) : "--"}
                        />

                        {/* Engine Capacity */}
                        <UserInputsBox
                            icon={<Cog className="w-4 h-4 text-gray-500" />}
                            title="Engine Capacity"
                            value={cc ? `${cc}cc` : "--"}
                        />

                        {/* Fuel Type */}
                        <UserInputsBox
                            icon={<Fuel className="w-4 h-4 text-gray-500" />}
                            title="Fuel Type"
                            value={fuelType ? formatValue(fuelType) : "--"}
                        />

                        {/* Transmission */}
                        <UserInputsBox
                            icon={<Settings className="w-4 h-4 text-gray-500" />}
                            title="Transmission"
                            value={transmission ? formatValue(transmission) : "--"}
                        />

                        {/* Vehicle origin */}
                        <UserInputsBox
                            icon={<Bolt className="w-4 h-4 text-gray-500" />}
                            title="Vehicle Origin"
                            value={origin ? formatValue(origin) : "--"}
                        />

                        {/* Mileage */}
                        <UserInputsBox
                            icon={<Gauge className="w-4 h-4 text-gray-500" />}
                            title="Mileage (KM)"
                            value={mileage ? formatMileage(mileage) : "--"}
                        />
                    </>
                )}

                {/* Insured sum */}
                <UserInputsBox
                    icon={<DollarSign className="w-4 h-4 text-gray-500" />}
                    title="Previous Insured Sum (MYR)"
                    value={insuredPrice ? formatInsuredPrice(insuredPrice) : "--"}
                />
            </div>
        </div>
    )
}