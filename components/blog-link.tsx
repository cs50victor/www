'use client'

import { ALL_WRITINGS } from '@/app/_w'
import { cn } from '@/lib/utils'
import { FileText, Globe } from 'lucide-react'
import Link from 'next/link'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentPropsWithoutRef } from 'react'
import { useEffect, useMemo, useState } from 'react'

type BlogLinkProps = ComponentPropsWithoutRef<'a'>

type LinkPreview = {
  domain: string
  iconHost: string
  label: string
  kind: 'internal' | 'external'
}

const INTERNAL_HOSTS = new Set(['vic.so', 'www.vic.so'])

const BLOG_LINK_CLASS_NAME =
  'not-prose rounded-sm px-0.5 text-[1em] leading-[inherit] underline decoration-dotted underline-offset-6 transition-colors duration-150 hover:bg-zinc-100 hover:decoration-transparent focus-visible:bg-zinc-100 focus-visible:decoration-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:hover:bg-zinc-900/60 dark:focus-visible:bg-zinc-900/60 dark:focus-visible:ring-zinc-700'

const INTERNAL_POSTS = new Map<string, { title: string }>(
  ALL_WRITINGS.map(({ slug, title }) => [slug, { title }]),
)

function getResolvedUrl(href: string): URL | null {
  try {
    return new URL(href, 'https://vic.so')
  } catch {
    return null
  }
}

function getDomain(hostname: string): string {
  return hostname.replace(/^www\./, '')
}

function getInternalPreview(url: URL): LinkPreview {
  const post = INTERNAL_POSTS.get(url.pathname)

  if (post) {
    return {
      domain: getDomain(url.hostname),
      iconHost: url.hostname,
      label: post.title,
      kind: 'internal',
    }
  }

  return {
    domain: getDomain(url.hostname),
    iconHost: url.hostname,
    label: `${url.pathname}${url.search}${url.hash}` || '/',
    kind: 'internal',
  }
}

function getExternalPreview(url: URL): LinkPreview {
  return {
    domain: getDomain(url.hostname),
    iconHost: url.hostname,
    label: getDomain(url.hostname),
    kind: 'external',
  }
}

function ExternalFavicon({ host }: { host: string }) {
  const sources = useMemo(
    () => [
      `https://icons.duckduckgo.com/ip3/${host}.ico`,
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`,
    ],
    [host],
  )
  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    setSourceIndex(0)
  }, [host])

  const source = sources[sourceIndex]

  if (!source) {
    return (
      <Globe
        className="size-3 shrink-0 text-zinc-500 dark:text-zinc-400"
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      src={source}
      alt=""
      aria-hidden="true"
      className="size-3 shrink-0 rounded-[3px]"
      referrerPolicy="no-referrer"
      onError={() => setSourceIndex((current) => current + 1)}
    />
  )
}

function PreviewPill({ preview }: { preview: LinkPreview }) {
  return (
    <div className="inline-flex max-w-[14rem] items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 text-xs text-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.10)] backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-200">
      {preview.kind === 'internal' ? (
        <FileText
          className="size-3 shrink-0 text-zinc-500 dark:text-zinc-400"
          aria-hidden="true"
        />
      ) : (
        <ExternalFavicon host={preview.iconHost} />
      )}
      <span className="truncate">{preview.label}</span>
    </div>
  )
}

function getTargetValue(
  href: string | undefined,
  target: string | undefined,
): string | undefined {
  if (target) return target
  if (!href || href.startsWith('#')) return undefined

  if (
    href.startsWith('/') ||
    href.startsWith('.') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  ) {
    return '_blank'
  }

  return undefined
}

function getRelValue(
  rel: string | undefined,
  target: string | undefined,
): string | undefined {
  if (target !== '_blank') return rel

  const values = new Set((rel || '').split(/\s+/).filter(Boolean))
  values.add('noopener')
  values.add('noreferrer')

  return Array.from(values).join(' ')
}

export function BlogLink({
  href,
  className,
  children,
  ...props
}: BlogLinkProps) {
  const target = getTargetValue(href, props.target)
  const rel = getRelValue(props.rel, target)
  const resolvedUrl = useMemo(
    () => (href ? getResolvedUrl(href) : null),
    [href],
  )
  const isPreviewable = Boolean(
    href &&
      resolvedUrl &&
      !href.startsWith('#') &&
      (resolvedUrl.protocol === 'https:' || resolvedUrl.protocol === 'http:'),
  )

  const isInternalPreview = Boolean(
    resolvedUrl && INTERNAL_HOSTS.has(resolvedUrl.hostname),
  )

  const initialPreview = useMemo(() => {
    if (!resolvedUrl) return null

    if (isInternalPreview) {
      return getInternalPreview(resolvedUrl)
    }

    if (!isPreviewable) {
      return null
    }

    return getExternalPreview(resolvedUrl)
  }, [isInternalPreview, isPreviewable, resolvedUrl])

  const [isOpen, setIsOpen] = useState(false)
  const preview = initialPreview

  const composedClassName = cn(BLOG_LINK_CLASS_NAME, className)
  const linkElement =
    href &&
    (href.startsWith('/') || href.startsWith('#') || href.startsWith('.')) ? (
      <Link
        href={href}
        className={composedClassName}
        {...props}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    ) : (
      <a
        href={href}
        className={composedClassName}
        {...props}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    )

  if (!preview || !isPreviewable) {
    return linkElement
  }

  return (
    <TooltipPrimitive.Provider delayDuration={120}>
      <TooltipPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <TooltipPrimitive.Trigger asChild>
          {linkElement}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="center"
            sideOffset={2}
            collisionPadding={16}
            className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 z-50"
          >
            <PreviewPill preview={preview} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
