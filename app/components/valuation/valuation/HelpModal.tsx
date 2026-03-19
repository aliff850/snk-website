// Help modal for valuation inquiry platform
// import { useState } from 'react'
import { X, BookOpenCheck, Info, Settings2, Cog, MapPin } from 'lucide-react'

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
}

interface HelpStepItem {
    description: React.ReactNode
}

interface HelpStepListProps {
    items: HelpStepItem[]
}

export function HelpStepList({ items }: HelpStepListProps) {
    return (
        <ul className="flex flex-col gap-2 text-brand-black">
            {items.map((item, index) => (
                <li key={index} className="text-sm md:-text-base flex items-start gap-2">
                    <span className="text-brand">•</span>
                    <span>
                        {item.description}
                    </span>
                </li>
            ))}
        </ul>
    )
}

export function HelpContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-xl p-2 md:p-4 border border-brand flex flex-col gap-2 md:gap-4">
            {children}
        </div>
    )
}

export function StepIcon({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
    return (
        <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-brand/20 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-brand" />
        </div>
    )
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-brand p-4 md:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <Info className="w-8 h-8" />
                            <h2 className="text-xl md:text-2xl font-bold">How To Use?</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="flex flex-col gap-4">

                        {/* Vehicle class */}
                        <div className="flex gap-4">
                            <StepIcon icon={Cog} />
                            <div className="flex-1">
                                <HelpContainer>
                                    <h3 className="md:text-lg font-semibold text-brand-black">Step 1: Valuation Type</h3>
                                    <p className="text-sm md:text-base text-brand-black">
                                        Select the appropriate valuation type first before proceeding. There are three types of valuation as of now including:
                                    </p>

                                    <HelpStepList
                                        items={[
                                            { description: 'Car: Valuation for passenger vehicles' },
                                            { description: 'Motorcycles: Valuation for two-wheeled passenger vehicles' },
                                            { description: 'Commercial: Valuation for commercial vehicles such as lorries or prime movers' },
                                            { description: 'Windscreen (Coming Soon): Valuation for windscreens' }
                                        ]}
                                    />
                                </HelpContainer>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <StepIcon icon={MapPin} />
                            <div className="flex-1">
                                <HelpContainer>
                                    <h3 className="md:text-lg font-semibold text-brand-black">Step 2: Region, Make and Model</h3>
                                    <p className="text-sm md:text-base text-brand-black">
                                        Once the valuation type is selected, select the region, make and model.
                                    </p>
                                    <p className="text-sm text-brand-black">
                                        <span className="font-bold">Note: </span>
                                        <span>For commercial vehicles, there is an additional option to select weight class (Below 10 tons and Above 10 tons).</span>
                                    </p>

                                    <HelpStepList
                                        items={[
                                            { description: 'Region: The region in Malaysia that your vehicle is from (Peninsular Malaysia or East Malaysia)' },
                                            { description: 'Make: The make or manufacturer of your vehicle' },
                                            { description: 'Model: The model of your vehicle' },
                                            { description: 'Weight Class: The weight class of your vehicle (for commercial vehicles only)' }
                                        ]}
                                    />
                                </HelpContainer>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <StepIcon icon={Settings2} />
                            <div className="flex-1">
                                <HelpContainer>
                                    <h3 className="md:text-lg font-semibold text-brand-black mb-2">Step 3: Apply Filters</h3>
                                    <p className="text-brand-black">
                                        After that, select the filters that fit your vehicle's description and specifications. There are three main categories of filters for our system.
                                    </p>
                                    <HelpContainer>
                                        <p className="text-brand-black font-semibold">1. Vehicle Identity</p>
                                        <HelpStepList
                                            items={[
                                                { description: 'Year: The model year of your vehicle' },
                                                { description: 'Body Type: Vehicle body type (Sedan, SUV, Box Truck etc)' },
                                                { description: 'Variant: The variant of your vehicle model' },
                                                { description: 'Series: The series of your vehicle model' },
                                                { description: 'Import Status: The import status of your vehicle (Whether it is locally assembled, imported, or recon)' },
                                            ]}
                                        />
                                    </HelpContainer>
                                    <HelpContainer>
                                        <p className="text-brand-black font-semibold">2. Technical Specifications</p>
                                        <HelpStepList
                                            items={[
                                                { description: "Fuel Type: Your vehicle's fuel type (Petrol, Diesel, Hybrid, Full Electric)" },
                                                { description: 'Transmission: Auto or Manual (Defaults to Auto for electric vehicles)' },
                                                { description: 'Engine Capacity (cc): The capacity of your engine (1332, 1498, 1598 etc)' },
                                                { description: "Electric Motor Watts: The motor power of your vehicle in kW (for full electric vehicles only)" },
                                                { description: "BDM (Weight With Load KG): Weight of the vehicle when loaded with cargo (For commercial vehicles only)" },
                                                { description: "BTM (Weight Without Load KG): Weight of the vehicle when empty (For commercial vehicles only)" },
                                            ]}
                                        />
                                    </HelpContainer>
                                    <HelpContainer>
                                        <p className="text-brand-black font-semibold">3. Vehicle Condition</p>
                                        <HelpStepList
                                            items={[
                                                { description: 'Condition: The condition of your vehicle (Ranges from Very Poor to Very Good)' },
                                                { description: "Mileage: Your vehicle's mileage in kilometers" },
                                                { description: 'Previous Insured Sum: The sum which your vehicle was insured at previously' }
                                            ]}
                                        />
                                    </HelpContainer>
                                    <p className="text-brand-black">
                                        Once the filters are set, click the <span className="font-semibold">"Get Market Value"</span> button to fetch market valuation.
                                    </p>
                                </HelpContainer>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <StepIcon icon={BookOpenCheck} />
                            <div className="flex-1">
                                <HelpContainer>
                                    <h3 className="md:text-lg font-semibold text-brand-black">Step 4: View & Manage Results</h3>
                                    <p className="text-brand-black">
                                        Once results load, you can:
                                    </p>

                                    <HelpStepList
                                        items={[
                                            { description: 'Ascending and Descending view: Toggle between "Low to High" and "High to Low" price sorting for the listings' },
                                            { description: 'Remove Listings: Click the trash icon to hide listings with incorrect details' },
                                            { description: 'Review Stats: Check price statistics to understand your vehicle market range' },
                                            { description: 'Review Insurable Value: Check insurable value statistics to understand your vehicle insurable value range' },
                                            { description: 'Save Valuation Result: Download the valuation result as a PDF' }
                                        ]}
                                    />
                                </HelpContainer>
                            </div>
                        </div>
                        <div>
                            <div className="rounded-xl p-2 md:p-4 border border-light-grey flex gap-2 items-center">
                                <Info className="w-4 h-4" />
                                <p className="text-brand-black">
                                    <strong>Tokens:</strong> Each valuation search costs 1 token. You will receive 3 tokens per week.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}