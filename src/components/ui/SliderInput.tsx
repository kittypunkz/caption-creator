interface Props {
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  unit?: string
}

export function SliderInput({ label, min, max, value, onChange, unit = '' }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs text-white/70 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500 h-1 rounded cursor-pointer"
      />
    </div>
  )
}
