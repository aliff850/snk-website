export function FormSelect({ value, onChange, disabled, options, labelFormatter }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    disabled: boolean
    options: string[] | { value: string; label: string }[]
    labelFormatter?: (value: string) => string
}) {
    const normalizedOptions = options.map(option => {
        if (typeof option === 'string') {
            const label = labelFormatter ? labelFormatter(option) : option
            return { value: option, label }
        }
        return option
    }).filter(option => option.value !== 'Any')

    return (
        <select value={value} onChange={onChange} disabled={disabled} className="w-full rounded-full border border-foreground/40 px-3 py-2 outline-none focus:border-brand transition-colors duration-150 disabled:border-foreground/20 disabled:text-foreground/20 disabled:bg-foreground/5">
            <option value="">--</option>
            {normalizedOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    )
}
