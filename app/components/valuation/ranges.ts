// Car valuation range filters

export const yearOptions: string[] = [
    'Any',
    ...Array.from({ length: 2025 - 1995 + 1 }, (_, i) => String(1995 + i))
]

export const mileageOptions: string[] = [
    'Any',
    ...Array.from({ length: Math.floor(400000 / 5000) }, (_, i) => String((i + 1) * 5000))
]

export const priceOptions: string[] = [
    'Any',
    ...Array.from({ length: Math.floor(450000 / 5000) }, (_, i) => String((i + 1) * 5000))
]

export const MIN_VALUES = {
    year: '1995',
    mileage: '5000',
    price: '5000'
}

// Engine capacity (liters) options and helpers
export const engineCapacityOptionsLiters: string[] = [
    'Any',
    ...Array.from({ length: Math.round(((5.0 - 1.0) / 0.1) + 1) }, (_, i) => (1.0 + i * 0.1).toFixed(1))
]

// Given a liter option like "1.5", return an inclusive CC range that
// captures that bucket, for example 1.5 -> 1400-1500 CC
export function getEngineCcRangeFromLiterOption(literOption: string): { min: number; max: number } | null {
    if (!literOption || literOption === 'Any') return null
    const liters = Number(literOption)
    if (!Number.isFinite(liters)) return null
    const centerCc = Math.round(liters * 1000)
    const min = Math.max(0, centerCc - 100)
    const max = centerCc
    return { min, max }
}

