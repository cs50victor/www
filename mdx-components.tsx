import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import { CodeSnippet } from './components/kibo-ui/snippet/code-snippet'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    img: ({ gray = true, ...props }: any) => (
      <Image
        width={1200}
        height={630}
        {...props}
        style={{ filter: gray ? 'grayscale(1) brightness(0.9)' : 'none' }}
        alt="blog post image"
      />
    ),
    pre: ({ children }) => {
      const codeContent = 
        typeof children?.props?.children === 'string' ? 
          children?.props?.children
          : ""
      const language = children?.props?.className?.replace("language-","") as string ?? "plaintext"
      return (
        <CodeSnippet
          commands={[
            {
              label: language,
              code: codeContent,
            }
          ]}
        />
      )
    },
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
          <div className="aspect-1024/526 w-full">
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
    EmailList: ({
      isDev = false,
    }: {
      isDev?: boolean
    }) => {
      const src = isDev 
        ? "https://vibecoderesponsibly.substack.com/embed"
        : "https://vicdotso.substack.com/embed"

      return (
        <>
          <span className='block py-6 opacity-0'>{"_"}</span>
          <iframe 
            src={src}
            // width="480" 
            // height="320" 
            className="w-full h-full my-9 border border-[#EEE] rounded-sm"
            // style={{ background: "black !important" }}
          />
        </>
      )
    },
  }
}
