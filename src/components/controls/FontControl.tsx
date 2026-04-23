import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'
import { SliderInput } from '../ui/SliderInput'
import { FONTS, THAI_FONTS, CODING_FONTS, loadGoogleFont } from '../../fonts/fontList'

function FontSelector({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (font: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/40">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-indigo-500"
      >
        <optgroup label="Thai Fonts" style={{ backgroundColor: '#18181b', color: '#e5e5e5' }}>
          {THAI_FONTS.map(f => (
            <option key={f.name} value={f.name} style={{ backgroundColor: '#18181b', color: '#e5e5e5' }}>{f.name}</option>
          ))}
        </optgroup>
        <optgroup label="Coding Fonts" style={{ backgroundColor: '#18181b', color: '#e5e5e5' }}>
          {CODING_FONTS.map(f => (
            <option key={f.name} value={f.name} style={{ backgroundColor: '#18181b', color: '#e5e5e5' }}>{f.name}</option>
          ))}
        </optgroup>
      </select>
    </div>
  )
}

export function FontControl() {
  const { titleFont, titleSize, subtitleFont, subtitleSize, set } = useStore()

  useEffect(() => {
    const tf = FONTS.find(f => f.name === titleFont)
    const sf = FONTS.find(f => f.name === subtitleFont)
    if (tf) loadGoogleFont(tf)
    if (sf) loadGoogleFont(sf)
  }, [titleFont, subtitleFont])

  useEffect(() => {
    const jbm = FONTS.find(f => f.name === 'JetBrains Mono')
    if (jbm) loadGoogleFont(jbm)
  }, [])

  return (
    <SectionHeader label="Fonts">
      <FontSelector
        label="Title font"
        value={titleFont}
        onChange={v => set({ titleFont: v })}
      />
      <SliderInput
        label="Title size"
        min={24}
        max={120}
        value={titleSize}
        onChange={v => set({ titleSize: v })}
        unit="px"
      />
      <FontSelector
        label="Subtitle font"
        value={subtitleFont}
        onChange={v => set({ subtitleFont: v })}
      />
      <SliderInput
        label="Subtitle size"
        min={14}
        max={60}
        value={subtitleSize}
        onChange={v => set({ subtitleSize: v })}
        unit="px"
      />
    </SectionHeader>
  )
}
