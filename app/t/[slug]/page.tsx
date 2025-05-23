import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'

type Props  = {
  params: Promise<{ slug: string }>
}
export async function generateMetadata(
  { params : _params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await _params;
  // Try to get metadata directly from the MDX file
  const postPath = path.join(process.cwd(), 'app/t', params.slug, 'page.mdx')
  
  try {
    // Check if this post exists
    if (!fs.existsSync(postPath)) {
      return notFound()
    }

    // Dynamic import to get the metadata from the MDX file
    const postModule = await import(`../../${params.slug}/page.mdx`)
    const postMetadata = postModule.metadata || {}
    
    // Construct full URL for dynamic OG image
    const ogImageUrl = new URL(`https://vic.so/t/${params.slug}/opengraph-image`).toString()
    
    // Get parent metadata (from layout.tsx)
    const previousImages = (await parent).openGraph?.images || []

    return {
      title: postMetadata.title,
      description: postMetadata.description,
      openGraph: {
        title: postMetadata.title,
        description: postMetadata.description,
        type: 'article',
        url: `https://vic.so/t/${params.slug}`,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: postMetadata.title }],
        siteName: 'Victor A.',
        locale: 'en_US',
        authors: ['Victor A.'],
        publishedTime: postMetadata.date,
        tags: postMetadata.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: postMetadata.title,
        description: postMetadata.description,
        images: [ogImageUrl],
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for ${params.slug}:`, error)
    // Return fallback metadata instead of parent to avoid type issues
    return {
      title: `Post - ${params.slug}`,
      description: 'A blog post by Victor A.',
      openGraph: {
        title: `Post - ${params.slug}`,
        description: 'A blog post by Victor A.',
        type: 'article',
        url: `https://vic.so/t/${params.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
      },
    }
  }
}

// This is a dynamic route handler that will redirect to the actual post
export default function SlugPage({ params }: Props) {
  // Next.js will automatically render the MDX file at /t/[slug]/page.mdx
  // This is just a placeholder component that will never be rendered
  return null
}