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
        destination: '/work/jamie',
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
