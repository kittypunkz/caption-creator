# Social Media Thumbnail Creator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based social media thumbnail creator with an IDE aesthetic — left controls panel, right live preview, export as PNG.

**Architecture:** Vite + React + TypeScript SPA. Single Zustand store drives all state. `ThumbnailCanvas` is a plain `<div>` with inline styles captured by `html-to-image` at full resolution. `PreviewPanel` scales the canvas down with CSS `transform: scale()` to fit the viewport — export always reads real dimensions.

**Tech Stack:** Vite, React 18, TypeScript, Zustand, Tailwind CSS v3, html-to-image, Vitest, @testing-library/react

---

## File Map

```
caption-creator/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── fonts/
│   │   └── fontList.ts
│   ├── store/
│   │   └── useStore.ts
│   ├── lib/
│   │   └── export.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── SliderInput.tsx
│   │   │   └── ColorPicker.tsx
│   │   ├── controls/
│   │   │   ├── ControlsPanel.tsx
│   │   │   ├── CanvasControl.tsx
│   │   │   ├── TextControl.tsx
│   │   │   ├── GradientControl.tsx
│   │   │   ├── FontControl.tsx
│   │   │   └── WindowControl.tsx
│   │   └── preview/
│   │       ├── PreviewPanel.tsx
│   │       ├── ThumbnailCanvas.tsx
│   │       ├── IDEWindow.tsx
│   │       └── TextLayers.tsx
└── src/__tests__/
    ├── fontList.test.ts
    ├── useStore.test.ts
    └── export.test.ts
```

---

## Task 1: Scaffold project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/main.tsx`, `index.html`

- [ ] **Step 1: Initialise Vite project**

Run from `/Users/_bankapirak/Documents/personal/caption-creator`:

```bash
npm create vite@latest . -- --template react-ts
```

When prompted "Current directory is not empty. Remove existing files and continue?" — choose **Yes** (only the docs folder exists, which Vite will not touch).

- [ ] **Step 2: Install all dependencies at once**

```bash
npm install
npm install zustand html-to-image
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind** — replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 4: Configure Vitest** — replace `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
```

- [ ] **Step 5: Create test setup file** — create `src/__tests__/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Replace `src/index.css`** with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
body { margin: 0; background: #0f0f0f; color: #e5e5e5; font-family: sans-serif; }
```

- [ ] **Step 7: Replace `src/main.tsx`** with:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 8: Add test script to `package.json`** — open `package.json` and add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server running at `http://localhost:5173`. Open it — you should see the default Vite + React page. Stop with Ctrl+C.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TS + Tailwind + Vitest"
```

---

## Task 2: Font list

**Files:**
- Create: `src/fonts/fontList.ts`
- Create: `src/__tests__/fontList.test.ts`

- [ ] **Step 1: Write the failing test** — create `src/__tests__/fontList.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { FONTS, THAI_FONTS, CODING_FONTS, loadGoogleFont } from '../fonts/fontList'

describe('fontList', () => {
  it('exports 10 fonts total', () => {
    expect(FONTS).toHaveLength(10)
  })

  it('has 5 thai fonts', () => {
    expect(THAI_FONTS).toHaveLength(5)
    THAI_FONTS.forEach(f => expect(f.category).toBe('thai'))
  })

  it('has 5 coding fonts', () => {
    expect(CODING_FONTS).toHaveLength(5)
    CODING_FONTS.forEach(f => expect(f.category).toBe('coding'))
  })

  it('every font has name, category and googleName', () => {
    FONTS.forEach(f => {
      expect(f.name).toBeTruthy()
      expect(f.category).toMatch(/^(thai|coding)$/)
      expect(f.googleName).toBeTruthy()
    })
  })

  it('loadGoogleFont is a function', () => {
    expect(typeof loadGoogleFont).toBe('function')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../fonts/fontList'"

- [ ] **Step 3: Create `src/fonts/fontList.ts`**

```ts
export interface FontOption {
  name: string
  category: 'thai' | 'coding'
  googleName: string
}

export const FONTS: FontOption[] = [
  { name: 'Sarabun',           category: 'thai',   googleName: 'Sarabun' },
  { name: 'Noto Sans Thai',    category: 'thai',   googleName: 'Noto+Sans+Thai' },
  { name: 'IBM Plex Sans Thai',category: 'thai',   googleName: 'IBM+Plex+Sans+Thai' },
  { name: 'Prompt',            category: 'thai',   googleName: 'Prompt' },
  { name: 'Kanit',             category: 'thai',   googleName: 'Kanit' },
  { name: 'JetBrains Mono',    category: 'coding', googleName: 'JetBrains+Mono' },
  { name: 'Fira Code',         category: 'coding', googleName: 'Fira+Code' },
  { name: 'Source Code Pro',   category: 'coding', googleName: 'Source+Code+Pro' },
  { name: 'Space Mono',        category: 'coding', googleName: 'Space+Mono' },
  { name: 'Inconsolata',       category: 'coding', googleName: 'Inconsolata' },
]

export const THAI_FONTS = FONTS.filter(f => f.category === 'thai')
export const CODING_FONTS = FONTS.filter(f => f.category === 'coding')

const loaded = new Set<string>()

export function loadGoogleFont(font: FontOption): void {
  if (loaded.has(font.googleName)) return
  loaded.add(font.googleName)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${font.googleName}:wght@400;600;700&display=swap`
  document.head.appendChild(link)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: 5 tests PASS in `fontList.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/fonts/fontList.ts src/__tests__/fontList.test.ts src/__tests__/setup.ts
git commit -m "feat: add font list with Thai and coding Google Fonts"
```

---

## Task 3: Zustand store

**Files:**
- Create: `src/store/useStore.ts`
- Create: `src/__tests__/useStore.test.ts`

- [ ] **Step 1: Write the failing test** — create `src/__tests__/useStore.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../store/useStore'"

- [ ] **Step 3: Create `src/store/useStore.ts`**

```ts
import { create } from 'zustand'

type CanvasPreset = 'twitter-og' | 'linkedin' | 'ig-square' | 'ig-story' | 'youtube' | 'custom'
type WindowStyle = 'macos' | 'windows' | 'none'

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
  set: (partial) => setState((state) => ({ ...state, ...partial })),
}))
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: all tests PASS (fontList + useStore)

- [ ] **Step 5: Commit**

```bash
git add src/store/useStore.ts src/__tests__/useStore.test.ts
git commit -m "feat: add Zustand store with full thumbnail state"
```

---

## Task 4: UI primitives

**Files:**
- Create: `src/components/ui/SectionHeader.tsx`
- Create: `src/components/ui/SliderInput.tsx`
- Create: `src/components/ui/ColorPicker.tsx`

These are simple, stateless components. No tests — render correctness is verified visually in later tasks.

- [ ] **Step 1: Create `src/components/ui/SectionHeader.tsx`**

```tsx
import { useState, ReactNode } from 'react'

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
```

- [ ] **Step 2: Create `src/components/ui/SliderInput.tsx`**

```tsx
interface Props {
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  unit?: string
}

export function SliderInput({ label, min, max, value, onChange, unit = '' }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs text-white/70 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500 h-1 rounded cursor-pointer"
      />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/ui/ColorPicker.tsx`**

```tsx
interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-white/50 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          className="w-24 bg-white/10 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white/80 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: add SectionHeader, SliderInput, ColorPicker UI primitives"
```

---

## Task 5: IDEWindow component

**Files:**
- Create: `src/components/preview/IDEWindow.tsx`

- [ ] **Step 1: Create `src/components/preview/IDEWindow.tsx`**

```tsx
import { ReactNode } from 'react'

interface Props {
  style: 'macos' | 'windows' | 'none'
  filename: string
  children: ReactNode
}

function MacOSTitleBar({ filename }: { filename: string }) {
  return (
    <div className="relative flex items-center px-3 py-2 bg-black/30 border-b border-white/10">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white/40 font-mono">
        {filename}
      </span>
    </div>
  )
}

function WindowsTitleBar({ filename }: { filename: string }) {
  return (
    <div className="flex items-center px-3 py-2 bg-black/30 border-b border-white/10">
      <span className="text-xs text-white/40 font-mono flex-1">{filename}</span>
      <div className="flex items-center gap-0.5">
        {['─', '□', '✕'].map((icon, i) => (
          <div key={i} className="w-6 h-5 flex items-center justify-center text-white/30 text-xs hover:bg-white/10">
            {icon}
          </div>
        ))}
      </div>
    </div>
  )
}

export function IDEWindow({ style, filename, children }: Props) {
  const roundedClass = style === 'none' ? 'rounded-xl' : 'rounded-lg overflow-hidden'

  if (style === 'none') {
    return (
      <div className={`${roundedClass} overflow-hidden`} style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="p-8">{children}</div>
      </div>
    )
  }

  return (
    <div className={roundedClass} style={{ background: 'rgba(0,0,0,0.5)' }}>
      {style === 'macos' ? (
        <MacOSTitleBar filename={filename} />
      ) : (
        <WindowsTitleBar filename={filename} />
      )}
      <div className="p-8">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/preview/IDEWindow.tsx
git commit -m "feat: add IDEWindow component with macOS/Windows/None styles"
```

---

## Task 6: TextLayers component

**Files:**
- Create: `src/components/preview/TextLayers.tsx`

- [ ] **Step 1: Create `src/components/preview/TextLayers.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/preview/TextLayers.tsx
git commit -m "feat: add TextLayers component with tag pill, title and subtitle"
```

---

## Task 7: ThumbnailCanvas component

**Files:**
- Create: `src/components/preview/ThumbnailCanvas.tsx`

This is the exportable div. It is a `forwardRef` component so the parent can pass a ref to `html-to-image`.

- [ ] **Step 1: Create `src/components/preview/ThumbnailCanvas.tsx`**

```tsx
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
  } = useStore()

  return (
    <div
      ref={ref}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        background: `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        flexShrink: 0,
      }}
    >
      <div style={{ width: '100%' }}>
        <IDEWindow style={windowStyle} filename={windowFilename}>
          <TextLayers
            tag={tag}
            title={title}
            subtitle={subtitle}
            titleFont={titleFont}
            titleSize={titleSize}
            subtitleFont={subtitleFont}
            subtitleSize={subtitleSize}
            accentColor={accentColor}
          />
        </IDEWindow>
      </div>
    </div>
  )
})

ThumbnailCanvas.displayName = 'ThumbnailCanvas'
```

- [ ] **Step 2: Commit**

```bash
git add src/components/preview/ThumbnailCanvas.tsx
git commit -m "feat: add ThumbnailCanvas exportable div driven by Zustand store"
```

---

## Task 8: PreviewPanel component

**Files:**
- Create: `src/components/preview/PreviewPanel.tsx`

- [ ] **Step 1: Create `src/components/preview/PreviewPanel.tsx`**

```tsx
import { useRef, useState, useEffect, RefObject } from 'react'
import { useStore } from '../../store/useStore'
import { ThumbnailCanvas } from './ThumbnailCanvas'

interface Props {
  canvasRef: RefObject<HTMLDivElement>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/preview/PreviewPanel.tsx
git commit -m "feat: add PreviewPanel with ResizeObserver-based scale calculation"
```

---

## Task 9: CanvasControl

**Files:**
- Create: `src/components/controls/CanvasControl.tsx`

- [ ] **Step 1: Create `src/components/controls/CanvasControl.tsx`**

```tsx
import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'

const PRESETS = [
  { id: 'twitter-og', label: 'Twitter/X OG',       width: 1200, height: 628  },
  { id: 'linkedin',   label: 'LinkedIn',            width: 1200, height: 627  },
  { id: 'ig-square',  label: 'Instagram Square',    width: 1080, height: 1080 },
  { id: 'ig-story',   label: 'Instagram Story',     width: 1080, height: 1920 },
  { id: 'youtube',    label: 'YouTube Thumbnail',   width: 1280, height: 720  },
  { id: 'custom',     label: 'Custom',              width: 0,    height: 0    },
] as const

type PresetId = typeof PRESETS[number]['id']

export function CanvasControl() {
  const { canvasPreset, canvasWidth, canvasHeight, set } = useStore()

  function handlePreset(id: PresetId) {
    const preset = PRESETS.find(p => p.id === id)!
    if (id === 'custom') {
      set({ canvasPreset: 'custom' })
    } else {
      set({ canvasPreset: id, canvasWidth: preset.width, canvasHeight: preset.height })
    }
  }

  return (
    <SectionHeader label="Canvas">
      <div className="flex flex-col gap-1.5">
        {PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => handlePreset(p.id)}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
              canvasPreset === p.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span className="font-medium">{p.label}</span>
            {p.id !== 'custom' && (
              <span className="ml-2 text-white/40">{p.width}×{p.height}</span>
            )}
          </button>
        ))}
      </div>
      {canvasPreset === 'custom' && (
        <div className="flex gap-2 mt-1">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-white/40">Width</label>
            <input
              type="number"
              value={canvasWidth}
              min={100}
              max={4000}
              onChange={e => set({ canvasWidth: Number(e.target.value) })}
              className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-white/40">Height</label>
            <input
              type="number"
              value={canvasHeight}
              min={100}
              max={4000}
              onChange={e => set({ canvasHeight: Number(e.target.value) })}
              className="bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </SectionHeader>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/controls/CanvasControl.tsx
git commit -m "feat: add CanvasControl with presets and custom size"
```

---

## Task 10: TextControl

**Files:**
- Create: `src/components/controls/TextControl.tsx`

- [ ] **Step 1: Create `src/components/controls/TextControl.tsx`**

```tsx
import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'

export function TextControl() {
  const { tag, title, subtitle, set } = useStore()

  return (
    <SectionHeader label="Text">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Tag</label>
        <input
          type="text"
          value={tag}
          placeholder="#React"
          onChange={e => set({ tag: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500 placeholder-white/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Main Title</label>
        <textarea
          value={title}
          placeholder="Your main title here"
          rows={3}
          onChange={e => set({ title: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-indigo-500 placeholder-white/20 resize-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Subtitle</label>
        <textarea
          value={subtitle}
          placeholder="Supporting text"
          rows={2}
          onChange={e => set({ subtitle: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-indigo-500 placeholder-white/20 resize-none"
        />
      </div>
    </SectionHeader>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/controls/TextControl.tsx
git commit -m "feat: add TextControl for tag, title and subtitle inputs"
```

---

## Task 11: GradientControl

**Files:**
- Create: `src/components/controls/GradientControl.tsx`

- [ ] **Step 1: Create `src/components/controls/GradientControl.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/controls/GradientControl.tsx
git commit -m "feat: add GradientControl with live preview swatch"
```

---

## Task 12: FontControl

**Files:**
- Create: `src/components/controls/FontControl.tsx`

This control dynamically loads Google Fonts when selected.

- [ ] **Step 1: Create `src/components/controls/FontControl.tsx`**

```tsx
import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'
import { SliderInput } from '../ui/SliderInput'
import { FONTS, THAI_FONTS, CODING_FONTS, loadGoogleFont, FontOption } from '../../fonts/fontList'

function FontSelector({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (font: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-white/40">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:outline-none focus:border-indigo-500"
      >
        <optgroup label="Thai Fonts">
          {THAI_FONTS.map(f => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </optgroup>
        <optgroup label="Coding Fonts">
          {CODING_FONTS.map(f => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </optgroup>
      </select>
    </div>
  )
}

export function FontControl() {
  const { titleFont, titleSize, subtitleFont, subtitleSize, set } = useStore()

  // Load both selected fonts on mount and when changed
  useEffect(() => {
    const tf = FONTS.find(f => f.name === titleFont)
    const sf = FONTS.find(f => f.name === subtitleFont)
    if (tf) loadGoogleFont(tf)
    if (sf) loadGoogleFont(sf)
  }, [titleFont, subtitleFont])

  // Also load JetBrains Mono for the tag pill on mount
  useEffect(() => {
    const jbm = FONTS.find(f => f.name === 'JetBrains Mono')
    if (jbm) loadGoogleFont(jbm)
  }, [])

  return (
    <SectionHeader label="Fonts">
      <FontSelector
        label="Title font"
        value={titleFont}
        onChange={v => set({ titleFont: v })}
      />
      <SliderInput
        label="Title size"
        min={24}
        max={120}
        value={titleSize}
        onChange={v => set({ titleSize: v })}
        unit="px"
      />
      <FontSelector
        label="Subtitle font"
        value={subtitleFont}
        onChange={v => set({ subtitleFont: v })}
      />
      <SliderInput
        label="Subtitle size"
        min={14}
        max={60}
        value={subtitleSize}
        onChange={v => set({ subtitleSize: v })}
        unit="px"
      />
    </SectionHeader>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/controls/FontControl.tsx
git commit -m "feat: add FontControl with dynamic Google Fonts loading"
```

---

## Task 13: WindowControl

**Files:**
- Create: `src/components/controls/WindowControl.tsx`

- [ ] **Step 1: Create `src/components/controls/WindowControl.tsx`**

```tsx
import { useStore } from '../../store/useStore'
import { SectionHeader } from '../ui/SectionHeader'
import { ColorPicker } from '../ui/ColorPicker'

const STYLES = [
  { id: 'macos',   label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'none',    label: 'None' },
] as const

type WinStyle = typeof STYLES[number]['id']

export function WindowControl() {
  const { windowStyle, windowFilename, accentColor, set } = useStore()

  return (
    <SectionHeader label="Window">
      <div className="flex gap-1.5">
        {STYLES.map(s => (
          <button
            key={s.id}
            onClick={() => set({ windowStyle: s.id as WinStyle })}
            className={`flex-1 py-1.5 rounded text-xs transition-colors ${
              windowStyle === s.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Filename</label>
        <input
          type="text"
          value={windowFilename}
          placeholder="index.tsx"
          onChange={e => set({ windowFilename: e.target.value })}
          className="bg-white/10 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 font-mono focus:outline-none focus:border-indigo-500 placeholder-white/20"
        />
      </div>
      <ColorPicker
        label="Tag accent color"
        value={accentColor}
        onChange={v => set({ accentColor: v })}
      />
    </SectionHeader>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/controls/WindowControl.tsx
git commit -m "feat: add WindowControl with OS style, filename and accent color"
```

---

## Task 14: ControlsPanel

**Files:**
- Create: `src/components/controls/ControlsPanel.tsx`

- [ ] **Step 1: Create `src/components/controls/ControlsPanel.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/controls/ControlsPanel.tsx
git commit -m "feat: add ControlsPanel assembling all control sections"
```

---

## Task 15: Export utility

**Files:**
- Create: `src/lib/export.ts`
- Create: `src/__tests__/export.test.ts`

- [ ] **Step 1: Write the failing test** — create `src/__tests__/export.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock html-to-image before importing export.ts
vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,abc123'),
}))

// Mock document.createElement for the <a> tag
const clickMock = vi.fn()
beforeEach(() => {
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      return { href: '', download: '', click: clickMock } as unknown as HTMLElement
    }
    return document.createElement(tag)
  })
})

import { exportToPng } from '../lib/export'

describe('exportToPng', () => {
  it('calls toPng with pixelRatio 2 and triggers download', async () => {
    const { toPng } = await import('html-to-image')
    const fakeEl = document.createElement('div')
    await exportToPng(fakeEl)
    expect(toPng).toHaveBeenCalledWith(fakeEl, { pixelRatio: 2 })
    expect(clickMock).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../lib/export'"

- [ ] **Step 3: Create `src/lib/export.ts`**

```ts
import { toPng } from 'html-to-image'

export async function exportToPng(element: HTMLElement, filename = 'thumbnail.png'): Promise<void> {
  const dataUrl = await toPng(element, { pixelRatio: 2 })
  const a = document.createElement('a')
  a.download = filename
  a.href = dataUrl
  a.click()
}
```

- [ ] **Step 4: Run all tests to verify they pass**

```bash
npm test
```

Expected: all tests PASS (fontList + useStore + export)

- [ ] **Step 5: Commit**

```bash
git add src/lib/export.ts src/__tests__/export.test.ts
git commit -m "feat: add PNG export utility using html-to-image"
```

---

## Task 16: App layout and final wiring

**Files:**
- Modify: `src/App.tsx`

This is the final wiring step — top nav bar + two-column layout. After this step, the full app is functional.

- [ ] **Step 1: Replace `src/App.tsx`** with:

```tsx
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
```

- [ ] **Step 2: Start dev server and verify the app**

```bash
npm run dev
```

Open `http://localhost:5173`. You should see:
- Dark top bar with app name left, "Export PNG" button right
- Left panel with 5 collapsible sections (Canvas, Text, Gradient, Fonts, Window)
- Right panel showing a live scaled preview with IDE window frame and text layers
- Changing any control updates the preview instantly
- Clicking "Export PNG" downloads `thumbnail.png`

- [ ] **Step 3: Run all tests one final time**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 4: Final commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up App layout with top nav, controls panel and preview"
```

---

## Self-Review Checklist

- [x] Canvas size presets (5 + custom) — Task 9
- [x] Tag / Title / Subtitle inputs — Task 10
- [x] Gradient start/end color pickers + angle slider — Task 11
- [x] Font selector (Thai + coding) with dynamic Google Fonts loading — Task 12
- [x] Font size sliders for title and subtitle — Task 12
- [x] Window OS style (macOS/Windows/None) — Task 13
- [x] Editable window filename — Task 13
- [x] Tag accent color picker — Task 13
- [x] IDE window frame pure CSS rendering — Task 5
- [x] Tag pill with JetBrains Mono fixed font — Task 6
- [x] Gradient background on canvas — Task 7
- [x] Preview scales to fit panel (ResizeObserver) — Task 8
- [x] Export PNG at 2× pixel ratio — Task 15
- [x] Thai font support via Google Fonts — Tasks 2, 12
- [x] Semi-transparent window interior (gradient bleed-through) — Task 5
