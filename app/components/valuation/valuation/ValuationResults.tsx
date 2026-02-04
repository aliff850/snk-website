"use client"

import { Button } from "../../ui/button"
import { Ban, Download, X, CarFront } from "lucide-react"
import UnifiedListingsDisplay from "../listings/UnifiedListingsDisplay"
import { useState, useRef } from "react"
// import Image from "next/image"
import { useReactToPrint } from "react-to-print"

interface ValuationResultsProps {
    link: string
    results: any | null
    error: string | null
    loading: boolean
    onClearResults: () => void
}

// Function for download popup
function ValuationDownloadPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

                <div className="py-2 flex flex-col items-center gap-2 text-brand-white">
                    <CarFront className="h-12 w-12" />
                    <p className="text-center text-brand-white text-lg font-medium">No valuation results to download</p>
                </div>

            </div>
        </div>
    )
}

export function ValuationResults({ link, results, error, loading, onClearResults }: ValuationResultsProps) {
    const [showPopup, setShowPopup] = useState(false)
    const componentRef = useRef<HTMLDivElement>(null)

    // Extract make and model for document title
    const make = results?.userInputs?.make || ''
    const model = results?.userInputs?.model || ''
    const documentTitle = make && model ? `${make} ${model} Valuation` : 'Valuation Result'

    // Handle the printing/downloading of the results
    const reactToPrintFn = useReactToPrint({
        contentRef: componentRef,
        documentTitle: documentTitle,
    })

    return (
        <>
            <ValuationDownloadPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
            <div ref={componentRef} className="rounded-2xl md:rounded-3xl border print:border-0 print:shadow-none print:p-4 border-foreground/20 shadow-sm bg-brand-white">

                <div id="valuation-results-header" className="print:px-0 print:py-2 p-4 md:p-6 border-b border-foreground/20 flex items-center justify-between">
                    <h4 className="text-2xl md:text-3xl text-brand font-bold">Valuation Result</h4>

                    {/* Buttons for clearing results and downloading */}
                    <div className="flex gap-3 print:hidden">
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
                            onClick={() => {
                                if (!results) {
                                    setShowPopup(true)
                                    return
                                }
                                if (reactToPrintFn) {
                                    reactToPrintFn()
                                }
                            }}
                        >
                            <span className="hidden md:block">Download</span>
                            <Download className="h-6 w-6" />
                        </Button>

                    </div>
                </div>

                {/* Display valuation results */}
                <div className="md:p-6 print:p-0 print:mt-8">
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
                            <p className="text-xs md:text-sm tracking-wide text-foreground/60">Fetching valuation result...</p>

                        </div>
                    )}
                    {/* Display results when available */}
                    {results && (
                        <div className="space-y-8">
                            <div className="p-2 md:p-0 print:p-0">
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

                {/* Document Footer */}
                <div className="hidden print:block border border-brand/20 p-2 print:p-4 rounded-xl mt-4 text-brand flex flex-col gap-2 items-center">
                    <p className="font-bold text-lg">Market value is based on</p>
                    <p className="text-3xl font-bold">{results?.listings?.length} {results?.listings?.length === 1 ? 'listing' : 'listings'}</p>
                    <p className="font-bold text-lg">from online sources.</p>
                </div>

                <div className="hidden print:block mt-8 pt-4 border-t border-gray-200">
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-center text-sm text-brand font-bold">Valuation produced by SNK Real Time Online Inquiry Platform</p>
                        <p className="text-center text-sm text-brand">© 2026 SNK Market Data. All rights reserved.</p>
                        <p className="text-center text-sm text-brand">www.snkmarketdata.com</p>
                    </div>
                </div>

            </div >
        </>
    )
}
