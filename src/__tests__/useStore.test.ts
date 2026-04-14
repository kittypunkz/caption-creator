import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store/useStore'

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      canvasPreset: 'twitter-og',
      canvasWidth: 1200,
      canvasHeight: 628,
      tag: '#React',
      title: 'Hello World',
      subtitle: 'A subtitle',
      gradientStart: '#6366f1',
      gradientEnd: '#ec4899',
      gradientAngle: 135,
      titleFont: 'JetBrains Mono',
      titleSize: 64,
      subtitleFont: 'Sarabun',
      subtitleSize: 32,
      windowStyle: 'macos',
      windowFilename: 'index.tsx',
      accentColor: '#6366f1',
    })
  })

  it('has correct initial canvas dimensions for twitter-og', () => {
    const state = useStore.getState()
    expect(state.canvasWidth).toBe(1200)
    expect(state.canvasHeight).toBe(628)
  })

  it('set updates a single field without touching others', () => {
    useStore.getState().set({ tag: '#Vue' })
    const state = useStore.getState()
    expect(state.tag).toBe('#Vue')
    expect(state.title).toBe('Hello World')
  })

  it('set updates gradient fields', () => {
    useStore.getState().set({ gradientStart: '#000000', gradientAngle: 90 })
    const state = useStore.getState()
    expect(state.gradientStart).toBe('#000000')
    expect(state.gradientAngle).toBe(90)
    expect(state.gradientEnd).toBe('#ec4899')
  })

  it('set updates window style', () => {
    useStore.getState().set({ windowStyle: 'windows' })
    expect(useStore.getState().windowStyle).toBe('windows')
  })
})
