import { toPng } from 'html-to-image'

export async function exportToPng(element: HTMLElement, filename = 'thumbnail.png'): Promise<void> {
  const dataUrl = await toPng(element, { pixelRatio: 2 })
  const a = document.createElement('a')
  a.download = filename
  a.href = dataUrl
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
