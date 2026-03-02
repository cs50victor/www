import { ALL_WRITINGS } from './_w';

export default async function sitemap() {
  const notes = ALL_WRITINGS.map((post) => ({
    url: `https://vic.so${post.slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = [''].map((route) => ({
    url: `https://vic.so${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...notes];
}
