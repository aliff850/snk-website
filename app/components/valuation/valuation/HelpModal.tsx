// Help modal for valuation inquiry platform
// import { useState } from 'react'
import { X, Car, Filter, Search, List, Info } from 'lucide-react'

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
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
                            <h2 className="text-xl md:text-3xl font-bold">How to Use Valuation Inquiry Platform</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col gap-2">

                                    <h3 className="text-xl font-semibold text-foreground">1. Select Make & Model</h3>
                                    <p className="text-foreground/60">
                                        Start by choosing the car make and model from the dropdown menus. The model list will populate automatically based on your selected make.
                                    </p>
                                    <div className="bg-gray-50 rounded-xl p-2 md:p-4 border border-foreground/40 flex gap-2 items-center">
                                        <Info className="w-4 h-4" />
                                        <p className="text-foreground/70">
                                            <strong>Required:</strong> Both Make and Model must be selected before searching.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-2 md:p-4 border border-foreground/40 flex gap-2 items-center">
                                        <Info className="w-4 h-4" />
                                        <p className="text-foreground/70">
                                            <strong>Tokens:</strong> Please ensure you have tokens before generating valuation (Coming Soon)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                                <Filter className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Apply Filters</h3>
                                <p className="text-gray-600 mb-3">
                                    Select the filters that fit your vehicle's description and specifications
                                </p>
                                <ul className="space-y-2 text-foreground/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Year:</strong> The model year of your vehicle
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Body Type:</strong> Vehicle body type (Sedan, Hatchback, SUV etc)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Engine Capacity:</strong> The capacity of your engine in liters (1.3, 1.5, 1.6 etc)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Fuel Type:</strong> Your vehicle's fuel type (Petrol, Diesel, Hybrid, Full Electric)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Transmission:</strong> Auto or Manual
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Origin:</strong> The origin of your vehicle (Imported, Local, Recon etc)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Condition:</strong> The condition of your vehicle (Ranges from Very Poor to Very Good)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Mileage:</strong> Your vehicle's mileage in kilometers
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-1">•</span>
                                        <span>
                                            <strong>Previous Insured Sum:</strong> The sum which your vehicle was insured at previously
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Search className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-foreground mb-2">3. Get Market Value</h3>

                                <p className="text-gray-600 mb-3">
                                    Click the <strong>"Get Market Value"</strong> button to fetch market valuation. The system will:
                                </p>
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200 space-y-2">
                                    <p className="text-foreground/70">
                                        ✓ Display market value statistics: lowest, average, and highest
                                    </p>
                                    <p className="text-foreground/70">
                                        ✓ Display 50 listings sorted by price (low to high)
                                    </p>
                                    <p className="text-foreground/70">
                                        ✓ If 50+ listings found, automatically fetch 50 more sorted by price (high to low)
                                    </p>
                                    <p className="text-foreground/70">
                                        ✓ Remove duplicates automatically
                                    </p>

                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <List className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1">

                                <h3 className="text-xl font-semibold text-foreground mb-2">4. View & Manage Results</h3>
                                <p className="text-gray-600 mb-3">
                                    Once results load, you can:
                                </p>

                                <ul className="space-y-2 text-foreground/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 font-bold mt-1">•</span>
                                        <span><strong>Ascending and Descending view:</strong> Toggle between "Low to High" and "High to Low" price sorting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 font-bold mt-1">•</span>
                                        <span><strong>Switch Views:</strong> Toggle between grid or list view</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 font-bold mt-1">•</span>
                                        <span><strong>Remove Listings:</strong> Click the trash icon to hide listings with incorrect details</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 font-bold mt-1">•</span>
                                        <span><strong>View Details:</strong> Click "View Listing" to see the full ad on Mudah</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 font-bold mt-1">•</span>
                                        <span><strong>Review Stats:</strong> Check price statistics to understand your vehicle market range</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 font-bold mt-1">•</span>
                                        <span><strong>Save Valuation Result:</strong> (Coming Soon)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold text-foreground flex items-center">
                                Important Notes
                            </h3>
                            <ul className="bg-blue-50 rounded-xl p-5 border border-blue-200 space-y-2 text-foreground">
                                {/* <li>• Use filters to narrow down results for more accurate pricing data</li> */}
                                <li>• Please select make and model before generating market valuation</li>
                                <li>• Review both ascending and descending views to spot outliers</li>
                                <li>• Remove obviously incorrect listings before analyzing prices</li>
                                {/* <li>• The average price is most reliable when you have 20+ listings</li>
                    <li>• Year and mileage ranges help find comparable vehicles</li> */}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold text-brand flex items-center">
                                Not Seeing Any Valuation Results?
                            </h3>
                            <ul className="bg-brand/10 rounded-xl p-5 border border-brand/50 space-y-2 text-foreground">

                                <li>• Some vehicles might not have enough market data for valuation (for now)</li>
                                <li>• Consider removing some filters and generating market valuation again</li>
                                <li>• As of now, having many filters can be too restrictive</li>

                            </ul>
                        </div>

                    </div>
                </div>

                {/* Footer
            <div className="border-t border-gray-200 p-4 bg-gray-50">
            <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
                Got it!
            </button>
            </div> */}
            </div>
        </div>
    )
}