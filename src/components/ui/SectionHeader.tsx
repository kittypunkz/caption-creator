import { useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

export function SectionHeader({ label, children }: Props) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
      >
        {label}
        <span className="text-white/30">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4 flex flex-col gap-3">{children}</div>}
    </div>
  )
}
