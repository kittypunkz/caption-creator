import { useRef, useState, useEffect } from 'react'
import type { RefObject } from 'react'
import { useStore } from '../../store/useStore'
import { ThumbnailCanvas } from './ThumbnailCanvas'

interface Props {
  canvasRef: RefObject<HTMLDivElement | null>
}

export function PreviewPanel({ canvasRef }: Props) {
  const { canvasWidth, canvasHeight } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      const s = Math.min(
        (width - 80) / canvasWidth,
        (height - 80) / canvasHeight,
        1
      )
      setScale(s)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [canvasWidth, canvasHeight])

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      style={{ minHeight: 0 }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: canvasWidth,
          height: canvasHeight,
          flexShrink: 0,
        }}
      >
        <ThumbnailCanvas ref={canvasRef} />
      </div>
    </div>
  )
}
