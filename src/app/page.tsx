import Link from 'next/link';
import { Plane, Globe, Compass, MapPin, Camera, Heart, Users } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const features = [
  {
    icon: Camera,
    title: 'Capture Memories',
    description: 'Create beautiful scrapbook entries with photos and stories from your travels'
  },
  {
    icon: MapPin,
    title: 'Track Adventures',
    description: 'Keep all your travel memories in one place with organized entries'
  },
  {
    icon: Heart,
    title: 'Share & Inspire',
    description: 'Connect with fellow travelers and share your favorite destinations'
  }
];

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
      <section className="bg-gradient-to-b from-[var(--color-bg)] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Globe className="text-[var(--color-secondary)] animate-pulse" size={48} />
              <Compass className="text-[var(--color-primary)] animate-pulse" size={48} />
            </div>
            <h1 className="text-[var(--color-text)] mb-6">
              Your Journey, <br />
              <span className="text-[var(--color-primary)]">Your Story</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Create beautiful scrapbook-style travel journals, share your adventures, 
              and get inspired by travelers from around the world ✈️
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/my-scrapbook"
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Plane size={24} />
                <span>Start Your Scrapbook</span>
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-2 bg-white text-[var(--color-secondary)] border-2 border-[var(--color-secondary)] px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Users size={24} />
                <span>Explore Community</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-[var(--color-text)] mb-12">Why RoverNote?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-paper)] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-4 border-white text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full mb-4">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-[var(--color-text)] mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gradient-to-b from-white to-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-[var(--color-text)] mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <Link
                key={index}
                href="/community"
                className="group relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-white"
                style={{ transform: `rotate(${(index % 2 ? -1 : 1) * 1}deg)` }}
              >
                <div className="bg-white p-3 shadow-md">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="mt-3 text-center">
                    <h3 className="text-[var(--color-text)]">{destination.name}</h3>
                    <p className="text-gray-600">{destination.country}</p>
                    <p className="text-sm text-[var(--color-secondary)] mt-2">
                      {destination.stories} travel stories
                    </p>
                  </div>
                </div>
                {/* Decorative tape */}
                <div className="absolute -top-2 left-1/4 w-16 h-5 bg-amber-100 opacity-60 rotate-[-5deg] shadow-sm"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-white/90 text-xl mb-8">
            Join our community of travelers and start documenting your journeys today!
          </p>
          <Link
            href="/my-scrapbook"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Plane size={24} />
            <span>Create Your First Entry</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
