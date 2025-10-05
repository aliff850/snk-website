"use client"

import React from "react"
import { Button } from "../ui/button"
import MudahListingsDisplay from "./MudahListingsDisplay"

interface ValuationResultsProps {
    results: any | null
    error: string | null
    loading: boolean
    onClearResults: () => void
}

export function ValuationResults({ results, error, loading, onClearResults }: ValuationResultsProps) {
    return (
        <div className="mt-10">
            <div className="rounded-3xl border border-foreground/20 shadow-sm bg-brand-white">

                <div className="p-6 border-b border-foreground/20 flex items-center justify-between">

                    <h4 className="text-2xl md:text-3xl text-brand font-bold">Market Listings</h4>
                    <div className="flex gap-3">
                        <Button 
                            onClick={onClearResults} 
                            variant="secondary"
                            size="sm"
                        >
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="p-6">
                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {!results && !loading && (
                        <div className="rounded-xl border border-dashed border-foreground/20 p-6 text-center text-gray-500">
                            <p className="text-sm">Market listings and pricing information will appear here.</p>
                        </div>
                    )}
                    {loading && (
                        <div className="space-y-8">
                            <div className="rounded-3xl border border-foreground/20 p-4">
                                {/* Loading animation skeleton */}
                                <div className="space-y-6">
                                    {/* Header skeleton */}
                                    <div className="flex flex-col mb-4">
                                        <div className="h-8 rounded-lg w-64 mb-2 animate-shimmer"></div>
                                        <div className="h-4 rounded-lg w-96 animate-shimmer"></div>
                                    </div>
                                    
                                    {/* Price cards skeleton */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="rounded-xl border border-gray-300 p-4 overflow-hidden">
                                            <div className="h-4 rounded w-20 mb-2 animate-shimmer"></div>
                                            <div className="h-10 rounded w-32 animate-shimmer"></div>
                                        </div>
                                        <div className="rounded-xl border border-gray-300 p-4 overflow-hidden">
                                            <div className="h-4 rounded w-24 mb-2 animate-shimmer"></div>
                                            <div className="h-10 rounded w-36 animate-shimmer"></div>
                                        </div>
                                        <div className="rounded-xl border border-gray-300 p-4 overflow-hidden">
                                            <div className="h-4 rounded w-22 mb-2 animate-shimmer"></div>
                                            <div className="h-10 rounded w-32 animate-shimmer"></div>
                                        </div>
                                    </div>

                                    {/* View toggle skeleton */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded animate-shimmer"></div>
                                            <div className="h-5 rounded w-12 animate-shimmer"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-10 rounded-lg w-32 animate-shimmer"></div>
                                            <div className="h-10 rounded-lg w-32 animate-shimmer"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Listing cards skeleton */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {Array.from({ length: 2 }).map((_, index) => (
                                            <div key={index} className="rounded-xl border border-foreground/20 bg-brand-white overflow-hidden">
                                                <div className="p-4 md:p-5">
                                                    {/* Header skeleton */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="h-6 rounded w-48 mb-2 animate-shimmer"></div>
                                                            <div className="h-4 rounded w-32 mb-2 animate-shimmer"></div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 rounded-full w-16 animate-shimmer"></div>
                                                                <div className="h-4 rounded w-20 animate-shimmer"></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="h-8 rounded w-20 animate-shimmer"></div>
                                                            <div className="w-6 h-6 rounded animate-shimmer"></div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Image skeleton */}
                                                    <div className="mt-3 rounded-lg h-48 animate-shimmer"></div>
                                                    
                                                    {/* Specs skeleton */}
                                                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                                        {Array.from({ length: 4 }).map((_, specIndex) => (
                                                            <div key={specIndex} className="flex items-center gap-2">
                                                                <div className="w-4 h-4 rounded animate-shimmer"></div>
                                                                <div>
                                                                    <div className="h-3 rounded w-16 mb-1 animate-shimmer"></div>
                                                                    <div className="h-4 rounded w-20 animate-shimmer"></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Button skeleton */}
                                                    <div className="mt-4 h-10 rounded-xl animate-shimmer"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {results && (
                        <div className="space-y-8">
                            <div className="rounded-3xl border border-foreground/20 p-4">
                                <MudahListingsDisplay 
                                    listings={results?.listings || []}
                                    listingsAscending={results?.listingsAscending || []}
                                    listingsDescending={results?.listingsDescending || []}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
