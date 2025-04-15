import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  description?: string
  excerpt?: string
  content: string
  [key: string]: any
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const postsDirectory = path.join(process.cwd(), 'app/t', slug)
    const fullPath = path.join(postsDirectory, 'page.mdx')
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    // Extract the frontmatter
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title || `Untitled: ${slug}`,
      description: data.description || data.excerpt || '',
      excerpt: data.excerpt || data.description || '',
      content,
      ...data,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}