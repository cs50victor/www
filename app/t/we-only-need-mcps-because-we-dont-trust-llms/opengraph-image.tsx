import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NAME } from '@/lib/constants'

export const runtime = 'nodejs'

export const alt = "We Only Need MCPs Because We Don't Trust LLMs"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const TITLE = "We Only Need MCPs Because We Don't Trust LLMs"

export default async function Image() {
  const [logoData, gowunBold] = await Promise.all([
    readFile(join(process.cwd(), 'public/images/mcp-logo-light.png')),
    fetch(
      'https://fonts.gstatic.com/s/gowunbatang/v12/ijwNs5nhRMIjYsdSgcMa3wRZ4J7awg.ttf',
    ).then((res) => res.arrayBuffer()),
  ])
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#ffffff',
          padding: '32px',
          color: '#111111',
          fontFamily: 'Gowun Batang, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            border: '2px solid #111111',
            borderRadius: '28px',
            padding: '42px 46px',
            justifyContent: 'space-between',
            background:
              'linear-gradient(180deg, #ffffff 0%, #ffffff 68%, #f5f5f5 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '58%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 64,
                  fontWeight: 700,
                  lineHeight: 1.04,
                  letterSpacing: '-0.05em',
                  marginBottom: '22px',
                }}
              >
                {TITLE}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {NAME}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '34%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                borderRadius: '24px',
                border: '1px solid #e5e5e5',
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '28px',
              }}
            >
              <img
                src={logoSrc}
                width={340}
                height={57}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Gowun Batang',
          data: gowunBold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  )
}
