import { ReactNode } from 'react'

interface Props {
  style: 'macos' | 'windows' | 'none'
  filename: string
  children: ReactNode
}

function MacOSTitleBar({ filename }: { filename: string }) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'rgba(0,0,0,0.3)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
      </div>
      <span style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'monospace',
      }}>
        {filename}
      </span>
    </div>
  )
}

function WindowsTitleBar({ filename }: { filename: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'rgba(0,0,0,0.3)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', flex: 1 }}>
        {filename}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {['─', '□', '✕'].map((icon, i) => (
          <div key={i} style={{
            width: 24,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 12,
          }}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  )
}

export function IDEWindow({ style, filename, children }: Props) {
  const containerStyle = {
    background: 'rgba(0,0,0,0.5)',
    borderRadius: style === 'none' ? 12 : 8,
    overflow: 'hidden' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  }

  if (style === 'none') {
    return (
      <div style={containerStyle}>
        <div style={{ padding: 32, flex: 1, display: 'flex', alignItems: 'center' }}>{children}</div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {style === 'macos' ? (
        <MacOSTitleBar filename={filename} />
      ) : (
        <WindowsTitleBar filename={filename} />
      )}
      <div style={{ padding: 32, flex: 1, display: 'flex', alignItems: 'center' }}>{children}</div>
    </div>
  )
}
