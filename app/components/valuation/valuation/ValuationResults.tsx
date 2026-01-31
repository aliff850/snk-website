"use client"

import { Button } from "../../ui/button"
import { Ban, Download, X } from "lucide-react"
import UnifiedListingsDisplay from "../listings/UnifiedListingsDisplay"
import { UnderConstruction } from "../../utility/underconstruction"
import { useState } from "react"

interface ValuationResultsProps {
    link: string
    results: any | null
    error: string | null
    loading: boolean
    onClearResults: () => void
}

// Function for popup under construction message
function UnderConstructionPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative bg-brand w-full max-w-sm rounded-2xl p-8 shadow-xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute right-4 top-4">
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-brand-white/80 hover:bg-brand-white/20 hover:text-brand-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="py-2">
                    <UnderConstruction />
                </div>

            </div>
        </div>
    )
}

export function ValuationResults({ link, results, error, loading, onClearResults }: ValuationResultsProps) {
    const [showPopup, setShowPopup] = useState(false)
    return (
        <>
            <UnderConstructionPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
            <div className="rounded-2xl md:rounded-3xl border border-foreground/20 shadow-sm bg-brand-white">

                <div className="p-4 md:p-6 border-b border-foreground/20 flex items-center justify-between">
                    <h4 className="text-2xl md:text-3xl text-brand font-bold">Valuation Results</h4>

                    {/* Buttons for clearing results and downloading */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onClearResults}
                            variant="secondary"
                            size="sm2"
                            className="md:text-xl flex gap-2"
                            href={link}
                        >
                            <span className="hidden md:block">Clear</span>
                            <Ban className="h-6 w-6" />

                        </Button>

                        <Button
                            variant="secondary"
                            size="sm2"
                            className="md:text-xl flex gap-2"
                            onClick={() => { setShowPopup(true) }}
                        >
                            <span className="hidden md:block">Download</span>
                            <Download className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Display valuation results */}
                <div className="md:p-6">
                    {/* Display error message if any */}
                    {error && (
                        <div className="mb-4 rounded-lg lg:border lg:border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {/* Display message when no results and not loading */}
                    {!results && !loading && (
                        <div className="rounded-xl lg:border lg:border-dashed lg:border-foreground/20 p-6 text-center text-gray-500">
                            <p className="text-sm">Market listings and pricing information will appear here.</p>
                        </div>
                    )}
                    {/* Display loading state when loading */}
                    {loading && (
                        <div className="flex flex-col items-center gap-4 py-10">

                            <svg
                                className="h-12 w-12 animate-spin"
                                viewBox="0 0 48 48"
                                fill="none"
                                aria-hidden="true"
                            >
                                {/* Track */}
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    className="text-foreground/20"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                />
                                {/* Active arc with gap and rounded ends */}
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    className="text-brand"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="100 200"
                                    strokeDashoffset="0"
                                    transform="rotate(-90 24 24)"
                                />
                            </svg>
                            <p className="text-xs md:text-sm tracking-wide text-foreground/60">Fetching results...</p>

                        </div>
                    )}
                    {/* Display results when available */}
                    {results && (
                        <div className="space-y-8">
                            <div className="p-2 md:p-0">
                                {/* Display unified listings through UnifiedListingsDisplay component */}

                                <UnifiedListingsDisplay
                                    listings={results?.listings || []}
                                    listingsAscending={results?.listingsAscending || []}
                                    listingsDescending={results?.listingsDescending || []}
                                    vehicleType={results?.vehicleType || 'car'}
                                    source={results?.source || 'Unknown'}
                                    counts={results?.counts}
                                    userInputs={results?.userInputs}
                                />

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
