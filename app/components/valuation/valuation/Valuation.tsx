"use client"

import { HelpModal } from "./HelpModal"
import { ValuationBar } from "../../ui/ValuationBar"
import { CarValuationNew } from "./cars/CarValuationNew" // Car valuation form component
import { MotorValuationForm } from "./motorcycle/MotorValuationForm" // Motorcycle valuation form component
import { useState } from "react"
import { HelpCircle } from 'lucide-react'
import { FaCar } from "react-icons/fa";
// import { FaCarOn } from "react-icons/fa6"
import { ValuationResults } from "./ValuationResults"
// import { Button } from "../../ui/button"

export function ValuationLayout() {
    // Active tab state
    const [activeTab, setActiveTab] = useState("car")

    // Help modal
    const [isHelpOpen, setIsHelpOpen] = useState(false)

    // Results state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [results, setResults] = useState<any | null>(null)

    const clearResults = () => {
        setResults(null)
        setError(null)
    }

    const handleSearch = (searchResults: any) => {
        if (searchResults.error) {
            setError(searchResults.error)
            setLoading(false)
        } else {
            setResults(searchResults)
            setError(null)
            setLoading(false)
        }
    }

    const handleSearchStart = () => {
        setLoading(true)
        setError(null)
        clearResults()
    }

    const handleReset = () => {
        clearResults()
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        clearResults()
        setError(null)
    }

    return (
        <div className="w-full bg-black/50 px-4 md:px-12 lg:px-24 pb-8 md:pb-16 pt-32 relative">
            {/* Help Button */}
            <button
                onClick={() => setIsHelpOpen(true)}
                className="fixed left-6 bottom-6 transform z-50 w-16 h-16 bg-brand border border-brand-element text-brand-white rounded-full shadow-lg hover:bg-brand/90 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Help"
            >
                <HelpCircle className="w-8 h-8" />
                <span
                    className="
                        absolute left-[90%] 
                        whitespace-nowrap 
                        opacity-0 
                        pointer-events-none 
                        group-hover:opacity-100 
                        group-hover:pointer-events-auto 
                        transition-all 
                        duration-300 
                        translate-y-2 
                        group-hover:translate-y-0
                        bg-brand border border-brand-element text-brand-white font-medium px-3 py-1 rounded-xl shadow
                        ml-4
                        text-base
                    "
                >
                    How To Use?
                </span>
            </button>

            <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">

                <div id="main" className="flex flex-col items-center gap-4 md:gap-6">
                    <div className="p-8 rounded-full bg-brand-element w-32 h-32">
                        <FaCar className="w-16 h-16 text-brand-white/80" />
                    </div>

                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-element">SNK Real-Time Online Inquiry Platform</h1>
                        <h3 className="text-2xl md:text-3xl font-bold text-brand-white">For Motor Vehicle Market Valuation</h3>
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-8 md:gap-12">

                    <div className="grid grid-cols-1 gap-4">
                        <ValuationBar
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />

                        <HelpModal
                            isOpen={isHelpOpen}
                            onClose={() => setIsHelpOpen(false)}
                        />

                        {/* Conditional rendering based on active tab */}
                        {/* Display valuation form based on active tab */}
                        {activeTab === "car" && (
                            <CarValuationNew
                                onSearch={handleSearch}
                                onReset={handleReset}
                                loading={loading}
                                onSearchStart={handleSearchStart}
                            />
                        )}
                        {activeTab === "motorcycle" && (
                            <MotorValuationForm
                                onSearch={handleSearch}
                                onReset={handleReset}
                                loading={loading}
                                onSearchStart={handleSearchStart}
                            />
                        )}
                    </div>

                    {/* Section to display all valuation results */}
                    <div id="valuation">
                        <ValuationResults
                            results={results}
                            error={error}
                            loading={loading}
                            onClearResults={clearResults}
                            link="#main"
                        />
                    </div>

                </div>

                {/* Section for vehicle specifications, commented out for now */}

                {/* <div className="bg-brand-white rounded-2xl md:rounded-3xl border border-foreground/40 p-4 md:p-6">
                    <div className="md:p-6 w-full flex flex-col gap-4 justify-center items-center md:border md:border-dashed md:border-foreground/20 rounded-2xl">
                        <div className="p-4 rounded-2xl md:rounded-3xl bg-brand-element/10">
                            <FaCarOn className="w-12 h-12 text-brand" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-center text-brand">Get Detailed Specifications Regarding Your Vehicle</h3>

                        <Button href="/valuation/specifications" variant="secondary" size="sm" className="flex md:text-xl gap-2">
                            Go to Vehicle Specifications <ArrowRight />
                        </Button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}