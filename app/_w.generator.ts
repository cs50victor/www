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

async function generateWritings() {
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

    const cleanedMetadata = (content.match(
      /export const metadata = \{([\s\S]*?)\};/,
    ) ?? [])[1]

    if (!cleanedMetadata) {
      const msg = `Missing metadata in ${filePath}`
      console.error(msg)
      // throw Error(msg);
      continue
    }

    const titleMatch = cleanedMetadata.match(/title: ['"](.+?)['"]/)
    const descriptionMatch = cleanedMetadata.match(/description: ['"](.+?)['"]/)
    const dateMatch = cleanedMetadata.match(/date: ['"](.+?)['"]/)
    const heroMatch = cleanedMetadata.match(/hero: (true|false)/)
    const tagsMatch = cleanedMetadata.match(/tags: \[(.*?)\]/)

    if (titleMatch && descriptionMatch && dateMatch) {
      const relativePath = path.relative(writingsDir, entry.path)
      writings.push({
        slug: `/t/${relativePath}`.replace(/\\/g, '/'),
        title: titleMatch[1],
        description: descriptionMatch[1],
        date: dateMatch[1],
        hero: heroMatch ? heroMatch[1] === 'true' : false,
        tags: tagsMatch
          ? tagsMatch[1]
              .split(',')
              .map((tag) => tag.trim().replace(/['"]/g, ''))
          : undefined,
      })
    }
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

// Run the generator
generateWritings().catch(console.error)

