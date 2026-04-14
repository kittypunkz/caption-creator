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
