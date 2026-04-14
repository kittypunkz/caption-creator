import { forwardRef } from 'react'
import { useStore } from '../../store/useStore'
import { IDEWindow } from './IDEWindow'
import { TextLayers } from './TextLayers'

export const ThumbnailCanvas = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    canvasWidth,
    canvasHeight,
    gradientStart,
    gradientEnd,
    gradientAngle,
    windowStyle,
    windowFilename,
    tag,
    title,
    subtitle,
    titleFont,
    titleSize,
    subtitleFont,
    subtitleSize,
    accentColor,
    textAlign,
  } = useStore()

  const fontScale = canvasWidth / 1200

  return (
    <div
      ref={ref}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 60,
        flexShrink: 0,
      }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <IDEWindow style={windowStyle} filename={windowFilename} textAlign={textAlign}>
          <TextLayers
            tag={tag}
            title={title}
            subtitle={subtitle}
            titleFont={titleFont}
            titleSize={Math.round(titleSize * fontScale)}
            subtitleFont={subtitleFont}
            subtitleSize={Math.round(subtitleSize * fontScale)}
            accentColor={accentColor}
          />
        </IDEWindow>
      </div>
    </div>
  )
})

ThumbnailCanvas.displayName = 'ThumbnailCanvas'
