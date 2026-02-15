"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'

interface Option {
    value: string
    label: string
}

interface SearchableSelectProps {
    value?: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    disabled?: boolean
    isLoading?: boolean
    className?: string
    emptyMessage?: string
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled = false,
    isLoading = false,
    className = "",
    emptyMessage = "No results found."
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If clicked outside, close the dropdown and clear the search query
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchQuery("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options
        return options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [options, searchQuery])

    const selectedOption = useMemo(() =>
        options.find(opt => opt.value === value),
        [options, value]
    )

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
        setSearchQuery("")
    }

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange("")
        setSearchQuery("")
    }

    // Determine what to display in the input
    // If open, show search query
    // If closed, show selected label or placeholder
    // const displayValue = isOpen ? searchQuery : (selectedOption?.label || "")

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <div
                className={`
                    flex items-center justify-between
                    w-full rounded-full border px-3 py-2 
                    bg-white
                    transition-colors duration-150
                    ${isOpen ? 'border-brand ring-1 ring-brand' : 'border-foreground/40'}
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-text'}
                `}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(true)
                        // customizable: focus input on open
                        setTimeout(() => inputRef.current?.focus(), 0)
                    }
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    className={`
                        w-full outline-none bg-transparent 
                        placeholder:text-foreground/40
                        ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                    placeholder={selectedOption ? selectedOption.label : placeholder}
                    value={isOpen ? searchQuery : (selectedOption?.label || "")}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        if (!isOpen) setIsOpen(true)
                    }}
                    onFocus={() => {
                        if (!disabled) setIsOpen(true)
                    }}
                    disabled={disabled}
                    // Prevent implicit form submission
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (filteredOptions.length > 0) {
                                handleSelect(filteredOptions[0].value)
                            }
                        }
                    }}
                />

                <div className="flex items-center gap-1">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="text-foreground/40 hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-foreground/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-2 text-sm text-foreground/50 text-center">Loading...</div>
                    ) : filteredOptions.length === 0 ? (
                        <div className="p-2 text-sm text-foreground/50 text-center">{emptyMessage}</div>
                    ) : (
                        <ul className="py-1">
                            {filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className={`
                                        relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm
                                        ${option.value === value ? 'bg-brand/10 text-brand font-medium' : 'text-foreground hover:bg-gray-100'}
                                    `}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span className="block truncate">{option.label}</span>
                                    {option.value === value && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand">
                                            <Check className="h-4 w-4" />
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
