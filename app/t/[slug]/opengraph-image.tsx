import { ImageResponse } from 'next/og'
import { NAME } from '@/lib/constants'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

// Known posts metadata - hardcoded for edge runtime compatibility
const POSTS_METADATA: Record<string, { title: string; description: string; date?: string }> = {
  'to-think': {
    title: 'Struggling to Think.',
    description: 'A personal reflection on the importance of writing for clear thinking.',
    date: '03/01/2025'
  },
  // TODO
  // 'vibe-code-responsibly': {
  //   title: 'Vibe Coding and Prompt Engineering might not exist in the next 3 years',
  //   description: 'Quick thoughts on how fast the coding landscape is evolving and some predictions.',
  //   date: '04/01/2025'
  // },
  'dev-tooling-2025': {
    title: 'My Dev Tooling in 2025: A Year of Agents, Rust, and Staying in Flow',
    description: 'A quarter-by-quarter breakdown of how my development workflow evolved in 2025, from DeepSeek R1 to Claude Code, and what I think comes next.',
    date: '10/09/2025'
  }
}

export async function generateStaticParams() {
  return Object.keys(POSTS_METADATA).map((slug) => ({
    slug,
  }))
}

export async function generateImageMetadata({ params: _params }: Props) {
  const params = await _params
  const metadata = POSTS_METADATA[params.slug]
  const title = metadata?.title || 'Blog Post'

  return [
    {
      id: 'default',
      alt: title,
    },
  ]
}

export default async function Image({ params: _params }: Props) {
  const params = await _params
  const metadata = POSTS_METADATA[params.slug]
  
  const title = metadata?.title || 'Blog Post'
  const description = metadata?.description || 'A blog post by Victor A.'
  const date = metadata?.date || ''

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