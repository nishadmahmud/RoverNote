import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.rovernote.live';

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
