'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Globe2, MapPin, Sparkles, Plane, Compass, Heart, Users, User, Lock } from 'lucide-react';
import { useCommunityJourneys, useMyJourneys } from '@/hooks/useJourneys';
import { useAuth } from '@/hooks/useAuth';
import { VercelStyleMap } from '@/components/VercelStyleMap';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

type MapView = 'community' | 'my-map';

export default function MapPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { journeys: communityJourneys, loading: communityLoading } = useCommunityJourneys();
  const { journeys: myJourneys, loading: myLoading } = useMyJourneys(user?.id);
  
  const [mapView, setMapView] = useState<MapView>('community');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryJourneys, setCountryJourneys] = useState<Journey[]>([]);

  // Determine which journeys to show based on the selected view
  const journeys = mapView === 'community' ? communityJourneys : myJourneys;
  const loading = mapView === 'community' ? communityLoading : myLoading;

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

  // Reset country selection when switching views
  const handleViewChange = (view: MapView) => {
    setMapView(view);
    setSelectedCountry(null);
    setCountryJourneys([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--paper))] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Globe2 className="w-16 h-16 text-secondary mx-auto mb-4 animate-pulse" />
            <Plane className="w-6 h-6 text-primary absolute top-0 right-1/4 animate-bounce" />
          </div>
          <p className="text-muted-foreground font-handwritten text-lg">Loading your adventure map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--paper))]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <Compass className="absolute top-20 left-10 text-accent opacity-20 animate-pulse" size={40} />
          <MapPin className="absolute top-32 right-20 text-primary opacity-20" size={30} />
          <Plane className="absolute bottom-10 left-1/4 text-secondary opacity-20 transform rotate-45" size={35} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="text-center mb-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Globe2 size={16} />
              <span>Interactive World Map</span>
              <Sparkles size={16} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
              Explore the World
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover destinations visited by our community of travelers. 
              Click on countries and markers to explore their stories ✈️
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex gap-1 p-1 bg-muted rounded-lg">
              <button
                onClick={() => handleViewChange('community')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all',
                  mapView === 'community'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Users className="h-4 w-4" />
                Community
              </button>
              <button
                onClick={() => handleViewChange('my-map')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all',
                  mapView === 'my-map'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="h-4 w-4" />
                My Map
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-4 md:gap-8 mb-6">
            <div className="text-center bg-card px-5 py-3 rounded-xl shadow-md border border-border/50 transform -rotate-1">
              <div className="text-2xl font-bold text-primary font-handwritten">
                {journeys.length}
              </div>
              <div className="text-muted-foreground text-sm">Stories</div>
            </div>
            <div className="text-center bg-card px-5 py-3 rounded-xl shadow-md border border-border/50 transform rotate-1">
              <div className="text-2xl font-bold text-secondary font-handwritten">
                {uniqueCountries.length}
              </div>
              <div className="text-muted-foreground text-sm">Countries</div>
            </div>
            <div className="text-center bg-card px-5 py-3 rounded-xl shadow-md border border-border/50 transform -rotate-1">
              <div className="text-2xl font-bold text-primary font-handwritten">
                {journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0)}
              </div>
              <div className="text-muted-foreground text-sm">Total Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Show login prompt for My Map if not logged in */}
        {mapView === 'my-map' && !user ? (
          <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Sign in to see your map</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Track your personal adventures and see all the places you&apos;ve explored on your own private map.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/auth">
                <Plane className="mr-2 h-4 w-4" />
                Sign In to Get Started
              </Link>
            </Button>
          </div>
        ) : mapView === 'my-map' && journeys.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
              <Globe2 className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Your map is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start documenting your travels to see them appear on your personal world map!
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/my-scrapbook">
                <Plane className="mr-2 h-4 w-4" />
                Add Your First Journey
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <VercelStyleMap
              journeys={journeys}
              onCountryClick={handleCountryClick}
              onMarkerClick={handleMarkerClick}
            />

            {/* Country Journeys Panel */}
            {selectedCountry && countryJourneys.length > 0 && (
              <div className="mt-8 bg-card rounded-2xl border border-border shadow-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden">
                {/* Decorative washi tape */}
                <div 
                  className="absolute -top-2 left-10 w-24 h-5 opacity-70 transform -rotate-2"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-amber)) 8%, hsl(var(--tape-amber)) 92%, transparent 100%)',
                  }}
                />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedCountry}
                    </h3>
                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {countryJourneys.length} {countryJourneys.length === 1 ? 'story' : 'stories'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCountry(null);
                      setCountryJourneys([]);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xl p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countryJourneys.map((journey, index) => (
                    <Link
                      key={journey.id}
                      href={`/journey/${journey.id}`}
                      className="group bg-background rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                      style={{ transform: `rotate(${index % 2 === 0 ? '-0.5' : '0.5'}deg)` }}
                    >
                      <div className="p-3 pb-0">
                        <div className="relative h-36 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={journey.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                            alt={journey.location || journey.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-foreground font-semibold truncate">
                          {journey.location || journey.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-2">
                          {formatDate(journey.start_date)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary text-sm font-handwritten">
                            by {journey.profiles?.display_name || 'Anonymous'}
                          </span>
                          <div className="flex items-center gap-1 text-primary text-sm">
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

            {/* Countries List */}
            {uniqueCountries.length > 0 && (
              <div className="mt-8 bg-card rounded-2xl shadow-lg p-6 border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe2 className="text-secondary" size={20} />
                  {mapView === 'community' ? 'All Countries Explored' : 'Countries You\'ve Visited'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueCountries.map((country, index) => {
                    const countryCount = journeys.filter(j => j.country === country).length;
                    return (
                      <button
                        key={index}
                        onClick={() => handleCountryClick(country!, journeys.filter(j => j.country === country))}
                        className="group px-4 py-2 bg-background rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition-all text-sm flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <span>{country}</span>
                        <span className="bg-muted group-hover:bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium">
                          {countryCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/community">
              <Plane className="mr-2 h-5 w-5" />
              View All Stories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
