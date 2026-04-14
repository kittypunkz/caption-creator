interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-white/50 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          className="w-24 bg-white/10 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white/80 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  )
}
