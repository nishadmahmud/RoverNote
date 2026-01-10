import Link from 'next/link';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';

const featuredDestinations = [
  {
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2MzY1MjM5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    stories: 24
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1717501787981-d5f28eb2df5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjBzdW5zZXR8ZW58MXx8fHwxNzYzNjE3OTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    stories: 18
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1641558996066-fcf78962c30a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwc3RyZWV0fGVufDF8fHx8MTc2MzY1NzUwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    stories: 31
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Destinations */}
      <section className="py-16 bg-gradient-to-b from-[hsl(var(--paper))] to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Popular Destinations</h2>
            <p className="text-lg text-muted-foreground">Discover where fellow travelers are journaling</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <Link
                key={index}
                href="/community"
                className="group relative bg-card p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ transform: `rotate(${(index % 2 ? -1 : 1) * 1}deg)` }}
              >
                <div className="bg-card p-3 shadow-md rounded-lg">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-56 object-cover rounded"
                  />
                  <div className="mt-3 text-center">
                    <h3 className="font-handwritten text-2xl text-foreground">{destination.name}</h3>
                    <p className="text-muted-foreground">{destination.country}</p>
                    <p className="text-sm text-primary mt-2">
                      {destination.stories} travel stories
                    </p>
                  </div>
                </div>
                {/* Decorative tape */}
                <div 
                  className="absolute -top-2 left-1/4 w-16 h-5 opacity-70 shadow-sm"
                  style={{
                    transform: 'rotate(-5deg)',
                    background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-amber)) 8%, hsl(var(--tape-amber)) 92%, transparent 100%)',
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
