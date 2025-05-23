import { ImageResponse } from 'next/server'
import { NAME } from '@/lib/constants'

export const runtime = 'edge'
export const alt = `${NAME} - Software Engineer`
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
            {NAME}
          </div>
          <div style={{ color: '#666666', fontSize: 24 }}>
            Software Engineer
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}