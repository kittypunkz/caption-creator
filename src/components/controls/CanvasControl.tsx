import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'

const PRESETS = [
  { id: 'twitter-og', label: 'Twitter/X OG',       width: 1200, height: 628  },
  { id: 'linkedin',   label: 'LinkedIn',            width: 1200, height: 627  },
  { id: 'ig-square',  label: 'Instagram Square',    width: 1080, height: 1080 },
  { id: 'ig-story',   label: 'Instagram Story',     width: 1080, height: 1920 },
  { id: 'youtube',    label: 'YouTube Thumbnail',   width: 1280, height: 720  },
  { id: 'custom',     label: 'Custom',              width: 0,    height: 0    },
] as const

type PresetId = typeof PRESETS[number]['id']

export function CanvasControl() {
  const { canvasPreset, canvasWidth, canvasHeight, set } = useStore()

  function handlePreset(id: PresetId) {
    const preset = PRESETS.find(p => p.id === id)!
    if (id === 'custom') {
      set({ canvasPreset: 'custom', canvasWidth: canvasWidth || 1200, canvasHeight: canvasHeight || 628 })
    } else {
      set({ canvasPreset: id, canvasWidth: preset.width, canvasHeight: preset.height })
    }
  }

  return (
    <SectionHeader label="Canvas">
      <div className="flex flex-col gap-1.5">
        {PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => handlePreset(p.id)}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
              canvasPreset === p.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span className="font-medium">{p.label}</span>
            {p.id !== 'custom' && (
              <span className="ml-2 text-white/40">{p.width}×{p.height}</span>
            )}
          </button>
        ))}
      </div>
      {canvasPreset === 'custom' && (
        <div className="flex gap-2 mt-1">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-white/40">Width</label>
            <input
              type="number"
              value={canvasWidth}
              min={100}
              max={4000}
              onChange={e => set({ canvasWidth: Number(e.target.value) })}
              className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-white/40">Height</label>
            <input
              type="number"
              value={canvasHeight}
              min={100}
              max={4000}
              onChange={e => set({ canvasHeight: Number(e.target.value) })}
              className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </SectionHeader>
  )
}
