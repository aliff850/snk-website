"use client"

import React from "react"
import { Button } from "../../ui/button"
import { Ban } from "lucide-react"
// import { TiDelete } from "react-icons/ti";
import UnifiedListingsDisplay from "../listings/UnifiedListingsDisplay"

interface ValuationResultsProps {
    link: string
    results: any | null
    error: string | null
    loading: boolean
    onClearResults: () => void
}

export function ValuationResults({ link, results, error, loading, onClearResults }: ValuationResultsProps) {
    return (

        <div className="rounded-2xl md:rounded-3xl border border-foreground/20 shadow-sm bg-brand-white">

            <div className="p-4 md:p-6 border-b border-foreground/20 flex items-center justify-between">
                <h4 className="text-2xl md:text-3xl text-brand font-bold">Valuation Results</h4>

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
                </div>
            </div>
            <div className="md:p-6">
                {error && (
                    <div className="mb-4 rounded-lg lg:border lg:border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}
                {!results && !loading && (
                    <div className="rounded-xl lg:border lg:border-dashed lg:border-foreground/20 p-6 text-center text-gray-500">
                        <p className="text-sm">Market listings and pricing information will appear here.</p>
                    </div>
                )}
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
                {results && (
                    <div className="space-y-8">
                        <div className="p-2 md:p-0">
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

    )
}
