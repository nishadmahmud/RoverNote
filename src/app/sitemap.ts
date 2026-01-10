import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rovernote.vercel.app';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch all public journeys for dynamic routes
  let journeyRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: journeys } = await supabase
      .from('journeys')
      .select('id, updated_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (journeys) {
      journeyRoutes = journeys.map((journey) => ({
        url: `${baseUrl}/journey/${journey.id}`,
        lastModified: new Date(journey.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching journeys for sitemap:', error);
  }

  return [...staticRoutes, ...journeyRoutes];
}
