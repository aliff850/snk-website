"use client"

import React from "react"
import { Button } from "../ui/button"

interface ValuationResultsProps {
    results: any | null
    error: string | null
    loading: boolean
    onClearResults: () => void
}

export function ValuationResults({ results, error, loading, onClearResults }: ValuationResultsProps) {
    return (
        <div className="mt-10">
            <div className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Results</h4>
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
                        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                            <p className="text-sm">Your pricing, specifications, features, and listings will appear here.</p>
                        </div>
                    )}
                    {results && (
                        <div className="space-y-8">
                            <div>
                                <h5 className="text-base font-semibold text-gray-900">
                                    {results.make?.toUpperCase()} {results.model?.toUpperCase()}
                                </h5>
                                {results.about?.price_range && (
                                    <p className="text-sm text-gray-700">
                                        Price when new: <span className="font-medium">{results.about.price_range}</span>
                                    </p>
                                )}
                                {results.about?.description && (
                                    <p className="mt-1 text-sm text-gray-600">{results.about.description}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <h6 className="font-semibold text-gray-900 mb-2">ZigWheels Pricing</h6>
                                    <div className="overflow-auto">
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                            {JSON.stringify(results.pricing, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <h6 className="font-semibold text-gray-900 mb-2">ZigWheels Specifications</h6>
                                    <div className="overflow-auto">
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                            {JSON.stringify(results.specifications, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h6 className="font-semibold text-gray-900 mb-2">ZigWheels Features</h6>
                                <div className="overflow-auto">
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                        {JSON.stringify(results.features, null, 2)}
                                    </pre>
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h6 className="font-semibold text-gray-900 mb-2">Mudah Listings</h6>
                                <div className="overflow-auto">
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                        {JSON.stringify(results.listings, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
