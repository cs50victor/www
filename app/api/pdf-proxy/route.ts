import { NextRequest, NextResponse } from 'next/server'
import net from 'node:net'

export const runtime = 'nodejs'

const MAX_REDIRECTS = 5

function isPrivateOrLocalhost(hostname: string): boolean {
  const lower = hostname.toLowerCase()
  if (lower === 'localhost') return true
  if (lower === '0.0.0.0') return true
  if (lower === '127.0.0.1') return true
  if (lower === '::1') return true

  const ipVersion = net.isIP(hostname)
  if (ipVersion === 0) return false

  if (ipVersion === 6) {
    const normalized = lower
    if (normalized === '::') return true
    if (normalized.startsWith('fe80:')) return true // NOTE(victor): link-local IPv6
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true // NOTE(victor): unique-local IPv6
    return false
  }

  const parts = hostname.split('.').map((p) => Number(p))
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true

  const [a, b] = parts

  if (a === 0) return true
  if (a === 10) return true
  if (a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true // NOTE(victor): carrier-grade NAT (RFC 6598)

  return false
}

async function fetchWithRedirects(
  initialUrl: URL,
  init: RequestInit,
  maxRedirects: number
): Promise<Response> {
  let current = initialUrl

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
    const res = await fetch(current, { ...init, redirect: 'manual' })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      if (!location) return res

      res.body?.cancel()

      const nextUrl = new URL(location, current)
      if (isPrivateOrLocalhost(nextUrl.hostname)) {
        throw new Error('Blocked redirect to private address')
      }

      current = nextUrl
      continue
    }

    return res
  }

  throw new Error('Too many redirects')
}

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url')
  if (!urlParam) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  let targetUrl: URL
  try {
    targetUrl = new URL(urlParam)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }

  if (targetUrl.protocol !== 'https:' && targetUrl.protocol !== 'http:') {
    return NextResponse.json({ error: 'Unsupported protocol' }, { status: 400 })
  }

  if (isPrivateOrLocalhost(targetUrl.hostname)) {
    return NextResponse.json({ error: 'Blocked host' }, { status: 400 })
  }

  const upstreamHeaders: Record<string, string> = {}
  const range = req.headers.get('range')
  if (range) upstreamHeaders['range'] = range
  const ifRange = req.headers.get('if-range')
  if (ifRange) upstreamHeaders['if-range'] = ifRange

  let upstream: Response
  try {
    upstream = await fetchWithRedirects(targetUrl, { headers: upstreamHeaders, cache: 'no-store' }, MAX_REDIRECTS)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch' },
      { status: 502 }
    )
  }

  if (!upstream.ok) {
    upstream.body?.cancel()
    return NextResponse.json(
      { error: `Upstream responded with ${upstream.status}` },
      { status: 502 }
    )
  }

  const contentType = upstream.headers.get('content-type') || 'application/pdf'

  const headers = new Headers()
  headers.set('content-type', contentType)
  headers.set('cache-control', 'no-store')

  const contentLength = upstream.headers.get('content-length')
  if (contentLength) headers.set('content-length', contentLength)

  const acceptRanges = upstream.headers.get('accept-ranges')
  if (acceptRanges) headers.set('accept-ranges', acceptRanges)

  const contentRange = upstream.headers.get('content-range')
  if (contentRange) headers.set('content-range', contentRange)

  const etag = upstream.headers.get('etag')
  if (etag) headers.set('etag', etag)

  const lastModified = upstream.headers.get('last-modified')
  if (lastModified) headers.set('last-modified', lastModified)

  return new Response(upstream.body, { status: upstream.status, headers })
}
