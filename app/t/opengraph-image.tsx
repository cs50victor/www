import { ImageResponse } from 'next/server'
import { WEBSITE_URL, NAME } from '@/lib/constants'

export const runtime = 'edge'
export const alt = `${NAME} - Thoughts`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          fontSize: 48,
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: '#000000', marginBottom: 20 }}>
            Thoughts
          </div>
          <div style={{ color: '#666666', fontSize: 24, textAlign: 'center' }}>
            Writing about tech related things I think are interesting.
          </div>
          <div style={{ color: '#888888', fontSize: 18, marginTop: 30 }}>
            {NAME}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}