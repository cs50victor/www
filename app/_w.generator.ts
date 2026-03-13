import { promises as fs } from 'fs'
import path from 'path'

export interface WritingPost {
  slug: string
  title: string
  description: string
  date: string
  hero?: boolean
  tags?: string[]
}

export function extractMetadataString(source: string, key: string) {
  const match = source.match(
    new RegExp(`${key}:\\s*("(?:\\\\.|[^"])*"|'(?:\\\\.|[^'])*')`),
  )

  if (!match) {
    return undefined
  }

  return new Function(`return ${match[1]}`)() as string
}

export function extractWritingMetadata(content: string) {
  const cleanedMetadata = (content.match(
    /export const metadata = \{([\s\S]*?)\};/,
  ) ?? [])[1]

  if (!cleanedMetadata) {
    return undefined
  }

  const title = extractMetadataString(cleanedMetadata, 'title')
  const description = extractMetadataString(cleanedMetadata, 'description')
  const date = extractMetadataString(cleanedMetadata, 'date')
  const heroMatch = cleanedMetadata.match(/hero: (true|false)/)
  const tagsMatch = cleanedMetadata.match(/tags: \[(.*?)\]/)

  if (!(title && description && date)) {
    return undefined
  }

  return {
    title,
    description,
    date,
    hero: heroMatch ? heroMatch[1] === 'true' : false,
    tags: tagsMatch
      ? tagsMatch[1]
          .split(',')
          .map((tag) => tag.trim().replace(/['"]/g, ''))
      : undefined,
  }
}

export async function generateWritings() {
  const writingsDir = path.join(process.cwd(), 'app', 't')
  const entries = await fs.readdir(writingsDir, {
    recursive: true,
    withFileTypes: true,
  })

  const writings: WritingPost[] = []

  for (const entry of entries) {
    if (!(entry.isFile() && entry.name === 'page.mdx')) {
      continue
    }
    const filePath = path.join(entry.parentPath, entry.name)
    const content = await fs.readFile(filePath, 'utf-8')

    const metadata = extractWritingMetadata(content)
    if (!metadata) {
      const msg = `Missing metadata in ${filePath}`
      console.error(msg)
      // throw Error(msg);
      continue
    }

    const relativePath = path.relative(writingsDir, entry.path)
    writings.push({
      slug: `/t/${relativePath}`.replace(/\\/g, '/'),
      ...metadata,
    })
  }

  // Sort writings by date (newest first)
  writings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  // If no hero is set, set the first element as hero
  if (!writings.some((w) => w.hero)) {
    writings[0].hero = true
  }

  const fileContent = `// This file is auto-generated. Do not edit it manually.
export const ALL_WRITINGS = ${JSON.stringify(writings, null, 2)} as const;
`

  await fs.writeFile(path.join(process.cwd(), 'app', '_w.ts'), fileContent)
}
