import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,abc123'),
}))

const clickMock = vi.fn()
const originalCreateElement = document.createElement.bind(document)
beforeEach(() => {
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') {
      return { href: '', download: '', click: clickMock } as unknown as HTMLElement
    }
    return originalCreateElement(tag)
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
