'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Globe2, MapPin, Sparkles, Plane, Compass, Heart } from 'lucide-react';
import { useCommunityJourneys } from '@/hooks/useJourneys';
import { VercelStyleMap } from '@/components/VercelStyleMap';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface Journey {
  id: string;
  title: string;
  location: string | null;
  country: string | null;
  image_url: string | null;
  start_date: string | null;
  likes_count: number;
  profiles?: {
    display_name: string | null;
  } | null;
}

export default function MapPage() {
  const router = useRouter();
  const { journeys, loading } = useCommunityJourneys();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryJourneys, setCountryJourneys] = useState<Journey[]>([]);

  const uniqueCountries = [...new Set(journeys.map(j => j.country).filter(Boolean))];

  const handleCountryClick = (country: string, journeysInCountry: Journey[]) => {
    setSelectedCountry(country);
    setCountryJourneys(journeysInCountry);
  };

  const handleMarkerClick = (journey: Journey) => {
    router.push(`/journey/${journey.id}`);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Globe2 className="w-16 h-16 text-[var(--color-secondary)] mx-auto mb-4 animate-pulse" />
            <Plane className="w-6 h-6 text-[var(--color-primary)] absolute top-0 right-1/4 animate-bounce" />
          </div>
          <p className="text-gray-600" style={{ fontFamily: 'Kalam, cursive' }}>Loading your adventure map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl"></div>
          {/* Floating icons */}
          <Compass className="absolute top-20 left-10 text-[var(--color-accent)] opacity-20 animate-pulse" size={40} />
          <MapPin className="absolute top-32 right-20 text-[var(--color-primary)] opacity-20" size={30} />
          <Plane className="absolute bottom-10 left-1/4 text-[var(--color-secondary)] opacity-20 transform rotate-45" size={35} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center mb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border-2 border-[var(--color-accent)] shadow-lg mb-6">
              <Globe2 className="text-[var(--color-secondary)]" size={18} />
              <span className="text-[var(--color-text)] text-sm font-medium" style={{ fontFamily: 'Kalam, cursive' }}>
                Interactive World Map
              </span>
              <Sparkles className="text-[var(--color-accent)]" size={18} />
            </div>
            
            <h1 className="text-[var(--color-text)] mb-4">
              Explore the World
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover destinations visited by our community of travelers. 
              Click on countries and markers to explore their stories ✈️
            </p>
          </div>

          {/* Stats - Scrapbook style */}
          <div className="flex justify-center gap-6 md:gap-12 mb-8">
            <div className="text-center bg-white px-6 py-4 rounded-2xl shadow-lg border-2 border-[var(--color-primary)]/30 transform -rotate-1">
              <div className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {journeys.length}
              </div>
              <div className="text-gray-600 text-sm" style={{ fontFamily: 'Kalam, cursive' }}>Stories</div>
            </div>
            <div className="text-center bg-white px-6 py-4 rounded-2xl shadow-lg border-2 border-[var(--color-secondary)]/30 transform rotate-1">
              <div className="text-3xl font-bold text-[var(--color-secondary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {uniqueCountries.length}
              </div>
              <div className="text-gray-600 text-sm" style={{ fontFamily: 'Kalam, cursive' }}>Countries</div>
            </div>
            <div className="text-center bg-white px-6 py-4 rounded-2xl shadow-lg border-2 border-[var(--color-accent)]/50 transform -rotate-1">
              <div className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                {journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0)}
              </div>
              <div className="text-gray-600 text-sm" style={{ fontFamily: 'Kalam, cursive' }}>Total Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <VercelStyleMap
          journeys={journeys}
          onCountryClick={handleCountryClick}
          onMarkerClick={handleMarkerClick}
        />

        {/* Country Journeys Panel - Scrapbook style */}
        {selectedCountry && countryJourneys.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl border-4 border-[var(--color-accent)] shadow-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden">
            {/* Decorative washi tape */}
            <div className="absolute -top-2 left-10 w-24 h-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-70 transform -rotate-2"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,.2) 5px, rgba(255,255,255,.2) 10px)' }}
            ></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📍</span>
                <h3 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                  {selectedCountry}
                </h3>
                <span className="bg-[var(--color-secondary)] text-white px-4 py-1 rounded-full text-sm font-bold">
                  {countryJourneys.length} {countryJourneys.length === 1 ? 'story' : 'stories'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setCountryJourneys([]);
                }}
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryJourneys.map((journey, index) => (
                <Link
                  key={journey.id}
                  href={`/journey/${journey.id}`}
                  className="group bg-[var(--color-paper)] rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[var(--color-secondary)] transition-all hover:shadow-xl transform hover:-rotate-1 hover:scale-[1.02]"
                  style={{ transform: `rotate(${index % 2 === 0 ? '-1' : '1'}deg)` }}
                >
                  {/* Polaroid style image */}
                  <div className="p-3 pb-0">
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={journey.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                        alt={journey.location || journey.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-[var(--color-text)] font-bold truncate" style={{ fontFamily: 'Kalam, cursive', fontSize: '1.1rem' }}>
                      {journey.location || journey.title}
                    </h4>
                    <p className="text-gray-500 text-sm mb-2">
                      {formatDate(journey.start_date)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--color-secondary)] text-sm" style={{ fontFamily: 'Caveat, cursive' }}>
                        by {journey.profiles?.display_name || 'Anonymous'}
                      </span>
                      <div className="flex items-center gap-1 text-[var(--color-primary)] text-sm">
                        <Heart size={14} fill="currentColor" />
                        <span>{journey.likes_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}


        {/* Countries List - Scrapbook style */}
        {uniqueCountries.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-6 border-4 border-[var(--color-paper)] relative overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
              }}
            ></div>
            
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2 relative" style={{ fontFamily: 'Permanent Marker, cursive' }}>
              <Globe2 className="text-[var(--color-secondary)]" size={24} />
              All Countries Explored
            </h3>
            <div className="flex flex-wrap gap-3 relative">
              {uniqueCountries.map((country, index) => {
                const countryCount = journeys.filter(j => j.country === country).length;
                return (
                  <button
                    key={index}
                    onClick={() => handleCountryClick(country!, journeys.filter(j => j.country === country))}
                    className="group px-5 py-2 bg-gradient-to-r from-[var(--color-bg)] to-white rounded-full border-2 border-[var(--color-secondary)]/30 text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all text-sm flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
                    style={{ fontFamily: 'Kalam, cursive' }}
                  >
                    <span>{country}</span>
                    <span className="bg-[var(--color-secondary)]/20 group-hover:bg-[var(--color-primary)]/20 px-2 py-0.5 rounded-full text-xs font-bold">
                      {countryCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold"
          >
            <Plane size={20} />
            <span style={{ fontFamily: 'Permanent Marker, cursive' }}>View All Stories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
