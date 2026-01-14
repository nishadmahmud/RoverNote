/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'dllqiizbzixyidsiqgvc.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  // Redirect www to non-www (canonical URL)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.rovernote.live',
          },
        ],
        destination: 'https://rovernote.live/:path*',
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
  // Remove trailing slashes for consistency
  trailingSlash: false,
};

module.exports = nextConfig;
