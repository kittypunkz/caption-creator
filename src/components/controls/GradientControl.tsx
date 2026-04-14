import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'
import { ColorPicker } from '../ui/ColorPicker'
import { SliderInput } from '../ui/SliderInput'

export function GradientControl() {
  const { gradientStart, gradientEnd, gradientAngle, set } = useStore()

  return (
    <SectionHeader label="Gradient">
      <div
        className="w-full h-8 rounded"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`,
        }}
      />
      <ColorPicker
        label="Start color"
        value={gradientStart}
        onChange={v => set({ gradientStart: v })}
      />
      <ColorPicker
        label="End color"
        value={gradientEnd}
        onChange={v => set({ gradientEnd: v })}
      />
      <SliderInput
        label="Angle"
        min={0}
        max={360}
        value={gradientAngle}
        onChange={v => set({ gradientAngle: v })}
        unit="°"
      />
    </SectionHeader>
  )
}
