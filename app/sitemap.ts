import { promises as fs } from 'fs';
import path from 'path';

async function getNoteSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.path, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

export default async function sitemap() {
  const writingDirectory = path.join(process.cwd(), 'app', 'w');
  const slugs = await getNoteSlugs(writingDirectory);

  const notes = slugs.map((slug) => ({
    url: `https://vic.so/w/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = [''].map((route) => ({
    url: `https://vic.so${route}`,
    lastModified: new Date().toISOString(),
  }));
  
  return [...routes, ...notes];
}