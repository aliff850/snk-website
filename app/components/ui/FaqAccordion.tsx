"use client"

import * as React from "react"

interface AccordionContextType {
  value: string | string[] | undefined
  onValueChange: (value: string | string[] | undefined) => void
  type: "single" | "multiple"
  collapsible: boolean
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

interface AccordionProps {
  type?: "single" | "multiple"
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[] | undefined) => void
  children: React.ReactNode
  className?: string
}

export function Accordion({ 
  type = "single", 
  collapsible = true, 
  value, 
  onValueChange, 
  children, 
  className = "" 
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[] | undefined>(
    type === "multiple" ? [] : undefined
  )
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  const contextValue = React.useMemo(() => ({
    value: currentValue,
    onValueChange: handleValueChange,
    type,
    collapsible
  }), [currentValue, handleValueChange, type, collapsible])

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={className}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className = "" }: AccordionItemProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("AccordionTrigger must be used within an Accordion")
  }

  const { value, onValueChange, type, collapsible } = context
  const itemValue = React.useContext(AccordionItemContext)
  
  const isOpen = type === "single" 
    ? value === itemValue
    : Array.isArray(value) && value.includes(itemValue)

  const handleClick = () => {
    if (type === "single") {
      onValueChange(isOpen && collapsible ? undefined : itemValue)
    } else {
      const currentValues = Array.isArray(value) ? value : []
      if (isOpen) {
        onValueChange(currentValues.filter(v => v !== itemValue))
      } else {
        onValueChange([...currentValues, itemValue])
      }
    }
  }

  return (
    <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center justify-between text-left transition-all duration-200 rounded-3xl ${className}`}
        aria-expanded={isOpen}
    >
        <div className="flex-1">
            {children}
        </div>
        {/* svg icon */}
        <svg 
            className={`ml-4 h-5 w-5 transition-transform duration-200 text-brand ${
            isOpen ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className = "" }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("AccordionContent must be used within an Accordion")
  }

  const { value, type } = context
  const itemValue = React.useContext(AccordionItemContext)
  
  const isOpen = type === "single" 
    ? value === itemValue
    : Array.isArray(value) && value.includes(itemValue)

  const contentRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [children])

  return (
    <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{
        maxHeight: isOpen ? `${height}px` : '0px'
        }}
    >
        <div ref={contentRef}>
        {children}
        </div>
    </div>
  )
}

// Context for tracking which item we're in
const AccordionItemContext = React.createContext<string>("")

// Enhanced AccordionItem that provides context
    export function AccordionItemWithContext({ value, children, className = "" }: AccordionItemProps) {
        return (
            <AccordionItemContext.Provider value={value}>
                <div className={className}>
                {children}
                </div>
            </AccordionItemContext.Provider>
        )
    }
