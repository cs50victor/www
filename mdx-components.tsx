import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => {
      return (
        <figure>
          <img src={src} alt={alt} className="rounded border px-3 py-2 bg-neutral-200 w-full" />
          <figcaption className="text-center">{caption}</figcaption>
        </figure>
      )
    },
  }
}
