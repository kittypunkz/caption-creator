import { CanvasControl } from './CanvasControl'
import { TextControl } from './TextControl'
import { GradientControl } from './GradientControl'
import { FontControl } from './FontControl'
import { WindowControl } from './WindowControl'

export function ControlsPanel() {
  return (
    <div className="w-80 shrink-0 flex flex-col bg-[#111111] border-r border-white/10 overflow-y-auto">
      <CanvasControl />
      <TextControl />
      <GradientControl />
      <FontControl />
      <WindowControl />
    </div>
  )
}
