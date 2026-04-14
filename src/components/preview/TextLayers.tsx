interface Props {
  tag: string
  title: string
  subtitle: string
  titleFont: string
  titleSize: number
  subtitleFont: string
  subtitleSize: number
  accentColor: string
}

export function TextLayers({
  tag,
  title,
  subtitle,
  titleFont,
  titleSize,
  subtitleFont,
  subtitleSize,
  accentColor,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {tag && (
        <div className="inline-flex">
          <span
            style={{
              backgroundColor: accentColor,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 6,
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {tag}
          </span>
        </div>
      )}
      {title && (
        <div
          style={{
            fontFamily: `'${titleFont}', sans-serif`,
            fontSize: titleSize,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            whiteSpace: 'pre-line',
          }}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontFamily: `'${subtitleFont}', sans-serif`,
            fontSize: subtitleSize,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}
