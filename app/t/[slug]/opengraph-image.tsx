import { ImageResponse } from 'next/server'
import { WEBSITE_URL, NAME } from '@/lib/constants'
import fs from 'fs'
import path from 'path'

export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateImageMetadata({ params: _params }: Props) {
  const params = await _params
  
  // Try to get metadata from the MDX file
  const postPath = path.join(process.cwd(), 'app/t', params.slug, 'page.mdx')
  
  let title = 'Blog Post'
  let description = 'A blog post by Victor A.'
  
  try {
    if (fs.existsSync(postPath)) {
      const postModule = await import(`../../${params.slug}/page.mdx`)
      const postMetadata = postModule.metadata || {}
      title = postMetadata.title || title
      description = postMetadata.description || description
    }
  } catch (error) {
    console.error(`Error loading metadata for ${params.slug}:`, error)
  }

  return [
    {
      id: 'default',
      alt: title,
    },
  ]
}

export default async function Image({ params: _params }: Props) {
  const params = await _params
  
  // Try to get metadata from the MDX file
  const postPath = path.join(process.cwd(), 'app/t', params.slug, 'page.mdx')
  
  let title = 'Blog Post'
  let description = 'A blog post by Victor A.'
  let date = ''
  
  try {
    if (fs.existsSync(postPath)) {
      const postModule = await import(`../../${params.slug}/page.mdx`)
      const postMetadata = postModule.metadata || {}
      title = postMetadata.title || title
      description = postMetadata.description || description
      date = postMetadata.date || ''
    }
  } catch (error) {
    console.error(`Error loading metadata for ${params.slug}:`, error)
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
          <div 
            style={{ 
              color: '#000000', 
              fontSize: 52, 
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {title}
          </div>
          <div 
            style={{ 
              color: '#666666', 
              fontSize: 24,
              lineHeight: 1.4,
              maxWidth: '100%',
            }}
          >
            {description}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ color: '#000000', fontSize: 28, fontWeight: 600 }}>
            {NAME}
          </div>
          {date && (
            <div style={{ color: '#888888', fontSize: 20 }}>
              {date}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}