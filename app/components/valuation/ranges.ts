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

