import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

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
          <div className="aspect-[1024/526] w-full">
            <Image
              src={src}
              alt={alt}
              sizes="100vw"
              width={1024}
              height={526}
              className="h-full w-full border object-cover rounded-sm"
            />
          </div>
          <figcaption className="text-foreground/20 mt-0 text-center text-xs">
            {caption}
          </figcaption>
        </figure>
      )
    },
  }
}
