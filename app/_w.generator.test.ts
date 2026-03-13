import { describe, expect, it } from 'bun:test'
import { extractMetadataString, extractWritingMetadata } from './_w.generator'

describe('extractMetadataString', () => {
  it('keeps apostrophes inside double-quoted metadata values', () => {
    const metadata = `title: "We Only Need MCPs Because We Don't Trust LLMs",`

    expect(extractMetadataString(metadata, 'title')).toBe(
      "We Only Need MCPs Because We Don't Trust LLMs",
    )
  })

  it('decodes escaped apostrophes inside single-quoted metadata values', () => {
    const metadata = `title: 'There Isn\\'t A Handbook',`

    expect(extractMetadataString(metadata, 'title')).toBe(
      "There Isn't A Handbook",
    )
  })
})

describe('extractWritingMetadata', () => {
  it('parses metadata blocks with apostrophes without truncating fields', () => {
    const content = `export const metadata = {
  title: "We Only Need MCPs Because We Don't Trust LLMs",
  description: "MCPs shouldn't truncate titles or descriptions.",
  tags: ["tech", "dev tooling"],
  hero: false,
  date: "03/12/2026",
};
`

    expect(extractWritingMetadata(content)).toEqual({
      title: "We Only Need MCPs Because We Don't Trust LLMs",
      description: "MCPs shouldn't truncate titles or descriptions.",
      date: '03/12/2026',
      hero: false,
      tags: ['tech', 'dev tooling'],
    })
  })
})
