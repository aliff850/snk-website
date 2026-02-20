"use client"

import { MapPin } from "lucide-react"
import { SelectionButtonGroup } from "./SelectionButtonGroup"

interface RegionSelectionProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function RegionSelection({ value, onChange, disabled }: RegionSelectionProps) {
    const regionItems = [
        { id: 'west', label: 'West Malaysia', icon: MapPin },
        { id: 'east', label: 'East Malaysia', icon: MapPin },
        // { id: 'langkawi', label: 'Langkawi', icon: MapPin }
    ]

    return (
        <div className="flex flex-col gap-2 border-b-2 border-brand/20 pb-4">
            {/* <p className="text-brand font-medium">*Region</p> */}
            <SelectionButtonGroup
                items={regionItems}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    )
}
