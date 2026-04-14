import { useStore } from '../../store/useStore'
import type { WindowStyle, TextAlign } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'
import { ColorPicker } from '../ui/ColorPicker'

const STYLES = [
  { id: 'macos',   label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'none',    label: 'None' },
] as const

const ALIGNMENTS: { id: TextAlign; label: string }[] = [
  { id: 'top',    label: 'Top' },
  { id: 'center', label: 'Center' },
  { id: 'bottom', label: 'Bottom' },
]

export function WindowControl() {
  const { windowStyle, windowFilename, accentColor, textAlign, set } = useStore()

  return (
    <SectionHeader label="Window">
      <div className="flex gap-1.5">
        {STYLES.map(s => (
          <button
            key={s.id}
            onClick={() => set({ windowStyle: s.id as WindowStyle })}
            className={`flex-1 py-1.5 rounded text-xs transition-colors ${
              windowStyle === s.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Filename</label>
        <input
          type="text"
          value={windowFilename}
          placeholder="index.tsx"
          onChange={e => set({ windowFilename: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500 placeholder-white/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Text position</label>
        <div className="flex gap-1.5">
          {ALIGNMENTS.map(a => (
            <button
              key={a.id}
              onClick={() => set({ textAlign: a.id })}
              className={`flex-1 py-1.5 rounded text-xs transition-colors ${
                textAlign === a.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker
        label="Tag accent color"
        value={accentColor}
        onChange={v => set({ accentColor: v })}
      />
    </SectionHeader>
  )
}
