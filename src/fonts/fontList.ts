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
