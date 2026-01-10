import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://rovernote.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/my-scrapbook', '/profile'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
