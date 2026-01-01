import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['mdx','tsx','ts'],
  async redirects() {
    return [
      {
        source: '/w',
        destination: '/?tab=Thoughts',
        permanent: true,
      },
      {
        source: '/t/no-instructions',
        destination: '/t/no-handbook',
        permanent: true,
      },
      {
        source: '/jamie',
        destination: '/fun/jamie',
        permanent: true
      },
      {
        source: '/work',
        destination: '/fun',
        permanent: true
      },
      {
        source: '/work/:path*',
        destination: '/fun/:path*',
        permanent: true
      },
      {
        source: '/crafts',
        destination: '/fun',
        permanent: true
      },
      {
        source: '/crafts/:path*',
        destination: '/fun/:path*',
        permanent: true
      }
    ]
  },
  experimental: {
    // mdxRs: true,
    viewTransition: true
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
