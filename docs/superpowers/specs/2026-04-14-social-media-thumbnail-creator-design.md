# Social Media Thumbnail Creator — Design Spec

**Date:** 2026-04-14  
**Status:** Approved  
**Inspired by:** ray-so (raycast/ray-so)

---

## 1. Overview

A browser-based social media thumbnail creator with a coding IDE aesthetic. Users configure a Tag, Main Title, and Subtitle displayed inside an IDE window frame over a customizable gradient background, then export the result as a PNG image. Thai language is fully supported via Google Fonts.

**Target users:** Developers and content creators who publish technical content on social media and want polished, code-themed thumbnails.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Vite + React + TypeScript | Lightweight, pure client-side, fast dev experience — no server needed |
| State | Zustand | Single store, minimal boilerplate, sufficient for this scale |
| Image export | html-to-image | Captures DOM node as PNG; handles web fonts including Thai correctly |
| Fonts | Google Fonts API (dynamic load) | Free, covers Thai + coding/monospace fonts with no install |
| Styling | Tailwind CSS | Utility-first, fast to build dark UI |
| Color picker | Native `<input type="color">` + hex field | Zero dependency, works in all modern browsers |

---

## 3. UX Journey

```
Open app → Edit text → Pick gradient → Choose fonts → Set window style → Export PNG
```

All steps happen on a single page with a live preview. No page transitions. Every change reflects instantly in the preview.

---

## 4. Layout

Single-page dark-themed app. Two-column split:

- **Left column (~320px fixed, scrollable):** Controls panel with 5 grouped sections
- **Right column (remaining width):** Centered live preview that scales to fit

**Top navigation bar:**
- Left: App name / logo
- Right: "Export PNG" button

---

## 5. Controls Panel

Five collapsible sections:

### 5.1 Canvas
- Preset size selector:
  - Twitter/X OG (1200×628)
  - LinkedIn (1200×627)
  - Instagram Square (1080×1080)
  - Instagram Story (1080×1920)
  - YouTube Thumbnail (1280×720)
  - Custom (manual W×H input)

### 5.2 Text Content
- **Tag** — short label text (e.g. `#React`, `ใหม่`)
- **Main Title** — primary headline, supports multi-line (up to 3 lines)
- **Subtitle** — secondary text, muted style, up to 2 lines

### 5.3 Gradient
- Start color picker (color wheel + hex input)
- End color picker (color wheel + hex input)
- Angle slider (0°–360°)

### 5.4 Fonts
- Title font family selector (Thai fonts + coding fonts from Google Fonts)
- Title font size slider
- Subtitle font family selector
- Subtitle font size slider
- Font loading indicator shown while Google Fonts fetch

**Curated font list:**

Thai fonts:
- Sarabun
- Noto Sans Thai
- IBM Plex Sans Thai
- Prompt
- Kanit

Coding / monospace fonts:
- JetBrains Mono
- Fira Code
- Source Code Pro
- Space Mono
- Inconsolata

### 5.5 Window
- OS style selector: macOS / Windows / None
- Window filename / title (free text input, e.g. `index.tsx`)
- Accent color picker (used for tag pill background)

---

## 6. Thumbnail Canvas (Exported Area)

The canvas is a plain `<div>` with inline styles. `html-to-image` captures it directly.

**Layers (back to front):**

1. **Gradient background** — full canvas, linear gradient using start color, end color, and angle
2. **IDE Window Frame** — centered, ~85% of canvas width
   - macOS: traffic light buttons (●●●) left-aligned in title bar + filename text centered
   - Windows: minimize/maximize/close icons right-aligned + filename text left
   - None: no chrome, rounded corners only
   - Interior: semi-transparent dark panel (`rgba(0,0,0,0.5)`) — gradient bleeds through subtly
3. **Text layers** (inside window interior):
   - **Tag pill** — rounded badge, accent color background, JetBrains Mono fixed (not user-configurable), small text
   - **Main Title** — large bold text, user-chosen font
   - **Subtitle** — smaller, lighter weight, muted color

**Preview scaling:** `PreviewPanel` wraps the canvas with CSS `transform: scale()` to fit the panel. The export always captures the canvas at its real pixel dimensions — not the scaled preview size.

---

## 7. Component Architecture

```
src/
├── App.tsx                     ← root layout, two-column split
├── store/
│   └── useStore.ts             ← single Zustand store
├── components/
│   ├── controls/
│   │   ├── ControlsPanel.tsx   ← scrollable left panel container
│   │   ├── CanvasControl.tsx   ← size preset + custom W×H
│   │   ├── TextControl.tsx     ← tag / title / subtitle inputs
│   │   ├── GradientControl.tsx ← start/end color pickers + angle slider
│   │   ├── FontControl.tsx     ← font family + size for title/subtitle
│   │   └── WindowControl.tsx   ← OS style + filename + accent color
│   ├── preview/
│   │   ├── PreviewPanel.tsx    ← scaled canvas wrapper
│   │   ├── ThumbnailCanvas.tsx ← exportable div, driven by store
│   │   ├── IDEWindow.tsx       ← macOS/Windows/None chrome (pure CSS)
│   │   └── TextLayers.tsx      ← tag pill + title + subtitle
│   └── ui/
│       ├── ColorPicker.tsx     ← native input[type=color] + hex text field
│       ├── SliderInput.tsx     ← range slider with numeric display
│       └── SectionHeader.tsx   ← collapsible control group header
├── lib/
│   └── export.ts               ← html-to-image PNG download logic
├── fonts/
│   └── fontList.ts             ← curated Thai + coding Google Fonts list
└── main.tsx
```

---

## 8. State Shape (Zustand)

```typescript
interface ThumbnailStore {
  // Canvas
  canvasPreset: 'twitter-og' | 'linkedin' | 'ig-square' | 'ig-story' | 'youtube' | 'custom'
  canvasWidth: number
  canvasHeight: number

  // Text
  tag: string
  title: string
  subtitle: string

  // Gradient
  gradientStart: string    // hex e.g. '#6366f1'
  gradientEnd: string      // hex e.g. '#ec4899'
  gradientAngle: number    // 0–360

  // Fonts
  titleFont: string        // Google Font name
  titleSize: number        // px
  subtitleFont: string
  subtitleSize: number

  // Window
  windowStyle: 'macos' | 'windows' | 'none'
  windowFilename: string
  accentColor: string      // hex, used for tag pill

  // Actions
  set: (partial: Partial<ThumbnailStore>) => void
}
```

---

## 9. Export

- **Trigger:** "Export PNG" button in top nav
- **Implementation:** `html-to-image` captures `ThumbnailCanvas` div at real pixel dimensions (not preview scale)
- **File name:** `thumbnail.png` (static, no versioning needed)
- **Pixel ratio:** 2× for retina-quality output
- **Font handling:** Google Fonts are already loaded in the browser DOM before export, so `html-to-image` captures them correctly

---

## 10. Out of Scope

- Shareable URL / URL hash encoding
- Copy to clipboard
- Multiple export formats (SVG, JPEG)
- User accounts or cloud save
- Template library
- Undo/redo history
