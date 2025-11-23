"use client"

import React from "react"
import { Button } from "../../ui/button"
import ZigWheelsDisplay from "./ZigAbout"
import { Ban } from "lucide-react"

interface SpecResultsProps {
    results: any | null
    error: string | null
    loading: boolean
    onClearResults: () => void
}

export function SpecResults({ results, error, loading, onClearResults }: SpecResultsProps) {
    return (
        <div className="rounded-3xl border border-foreground/20 shadow-sm bg-brand-white">
            <div className="p-4 md:p-6 border-b border-foreground/20 flex flex-col md:flex-row gap-2 items-center justify-between">
                <h4 className="text-2xl md:text-3xl text-brand font-bold">Vehicle Specifications</h4>
                <div>
                    <Button 
                        onClick={onClearResults} 
                        variant="secondary"
                        size="sm2"
                        className="text-xl flex gap-2"
                    >
                        <span className="hidden md:block">Clear</span>
                        <Ban className="h-6 w-6" />

                    </Button>
                </div>
            </div>
            <div className="p-4 md:p-6">
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}
                {!results && !loading && (
                    <div className="rounded-xl border border-dashed border-foreground/20 p-6 text-center text-foreground/50">
                        <p className="text-sm">Vehicle specifications, pricing, features, and details will appear here.</p>
                    </div>
                )}
                {results && (
                    <div className="space-y-8">
                        <div className="rounded-3xl md:border md:border-foreground/20 bg-brand-white">
                            <div className="md:p-6">
                                <ZigWheelsDisplay
                                    about={results?.about}
                                    pricing={results?.pricing}
                                    specifications={results?.specifications}
                                    features={results?.features}
                                    make={results?.make}
                                    model={results?.model}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
