import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

type Props  = {
  params: Promise<{ slug: string }>
}

// Known posts for build-time metadata generation
const KNOWN_POSTS = ['rust-python-js-sdk', 'to-think']

export async function generateStaticParams() {
  return KNOWN_POSTS.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata(
  { params : _params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await _params;
  
  // Check if this is a known post
  if (!KNOWN_POSTS.includes(params.slug)) {
    notFound()
  }
  
  try {
    // Use safer dynamic import approach
    const postModule = await import(`../../../app/t/${params.slug}/page.mdx`)
    const postMetadata = postModule.metadata || {}
    
    // Construct full URL for dynamic OG image
    const ogImageUrl = `https://vic.so/t/${params.slug}/opengraph-image`
    
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
    notFound()
  }
}

// This is a dynamic route handler that will redirect to the actual post
export default function SlugPage({ params }: Props) {
  // Next.js will automatically render the MDX file at /t/[slug]/page.mdx
  // This is just a placeholder component that will never be rendered
  return null
}