import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['mdx','tsx'],
  async redirects() {
    return [
      {
        source: '/w',
        destination: '/?tab=Writing',
        permanent: true,
      },
    ]
  },
  experimental: {
    // mdxRs: true,
    viewTransition: true
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);