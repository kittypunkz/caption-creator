import { create } from 'zustand'

type CanvasPreset = 'twitter-og' | 'linkedin' | 'ig-square' | 'ig-story' | 'youtube' | 'custom'
export type WindowStyle = 'macos' | 'windows' | 'none'
interface ThumbnailState {
  canvasPreset: CanvasPreset
  canvasWidth: number
  canvasHeight: number
  tag: string
  title: string
  subtitle: string
  gradientStart: string
  gradientEnd: string
  gradientAngle: number
  titleFont: string
  titleSize: number
  subtitleFont: string
  subtitleSize: number
  windowStyle: WindowStyle
  windowFilename: string
  accentColor: string
  textPosition: number
  set: (partial: Partial<Omit<ThumbnailState, 'set'>>) => void
}

export const useStore = create<ThumbnailState>((setState) => ({
  canvasPreset: 'twitter-og',
  canvasWidth: 1200,
  canvasHeight: 628,
  tag: '#React',
  title: 'Build Amazing\nUI Components',
  subtitle: 'A complete guide to modern React patterns',
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
  textPosition: 50,
  set: (partial) => setState((state) => ({ ...state, ...partial })),
}))
