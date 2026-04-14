import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'

export function TextControl() {
  const { tag, title, subtitle, set } = useStore()

  return (
    <SectionHeader label="Text">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Tag</label>
        <input
          type="text"
          value={tag}
          placeholder="#React"
          onChange={e => set({ tag: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500 placeholder-white/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Main Title</label>
        <textarea
          value={title}
          placeholder="Your main title here"
          rows={3}
          onChange={e => set({ title: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-indigo-500 placeholder-white/20 resize-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Subtitle</label>
        <textarea
          value={subtitle}
          placeholder="Supporting text"
          rows={2}
          onChange={e => set({ subtitle: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-indigo-500 placeholder-white/20 resize-none"
        />
      </div>
    </SectionHeader>
  )
}
