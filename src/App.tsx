import { useRef } from 'react'
import { ControlsPanel } from './components/controls/ControlsPanel'
import { PreviewPanel } from './components/preview/PreviewPanel'
import { exportToPng } from './lib/export'

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null)

  async function handleExport() {
    if (!canvasRef.current) return
    await exportToPng(canvasRef.current)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top navigation bar */}
      <header className="flex items-center justify-between px-5 py-3 bg-[#111111] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/90 font-mono tracking-tight">
            {'<'} thumbnail.so {'>'}
          </span>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition-colors"
        >
          Export PNG
        </button>
      </header>

      {/* Main two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <ControlsPanel />
        <PreviewPanel canvasRef={canvasRef} />
      </div>
    </div>
  )
}
