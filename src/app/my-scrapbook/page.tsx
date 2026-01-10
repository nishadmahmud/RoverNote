'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Plane, Loader2, BookOpen, Sparkles, MapPin, Camera } from 'lucide-react';
import { TravelEntry } from '@/components/TravelEntry';
import { AddEntryModal } from '@/components/AddEntryModal';
import { useAuth } from '@/hooks/useAuth';
import { useMyJourneys, useJourneyMutations } from '@/hooks/useJourneys';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function MyScrapbookPage() {
  const { user, loading: authLoading } = useAuth();
  const { journeys, loading, refetch } = useMyJourneys(user?.id);
  const { createJourney, loading: mutationLoading } = useJourneyMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleAddEntry = async (data: {
    title: string;
    location: string;
    country: string;
    date: string;
    notes: string;
    mustDos: string[];
    isPublic: boolean;
    mainImageFile?: File;
    additionalImageFiles?: File[];
    imageUrl?: string;
  }) => {
    const { error } = await createJourney({
      title: data.title,
      location: data.location,
      country: data.country,
      start_date: data.date,
      body: data.notes,
      tags: data.mustDos,
      is_public: data.isPublic,
      image_url: data.imageUrl,
    }, data.mainImageFile, data.additionalImageFiles);

    if (error) {
      toast.error('Failed to create entry: ' + error.message);
    } else {
      toast.success('Entry created! 🎉');
      setIsModalOpen(false);
      refetch();
    }
  };

  // Show loading or sign in prompt if not logged in
  if (!user) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--paper))] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--paper))] relative overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <BookOpen className="absolute top-20 left-[10%] h-16 w-16 text-primary/10 animate-float" />
          <MapPin className="absolute top-32 right-[15%] h-12 w-12 text-secondary/15 animate-float-reverse" />
          <Camera className="absolute bottom-40 left-[20%] h-10 w-10 text-accent/20 animate-bounce-slow" />
          <Plane className="absolute bottom-32 right-[25%] h-14 w-14 text-primary/10 animate-float" />
          
          {/* Abstract shapes */}
          <div className="absolute top-1/4 right-[5%] h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-[8%] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Decorative badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Your personal travel journal awaits</span>
            </div>

            {/* Main card */}
            <div className="relative">
              {/* Washi tape decoration */}
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 h-6 w-32 z-10 opacity-80"
                style={{
                  transform: 'translateX(-50%) rotate(-2deg)',
                  background: 'linear-gradient(90deg, transparent 0%, hsl(var(--tape-amber)) 8%, hsl(var(--tape-amber)) 92%, transparent 100%)',
                }}
              />
              
              <div className="bg-card p-10 md:p-14 rounded-2xl shadow-xl border border-border/50">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Your Scrapbook Awaits
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Sign in to create your personal travel journal. Capture memories, add photos, and build a beautiful collection of your adventures around the world.
                </p>

                {/* Features list */}
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {[
                    { icon: Camera, text: 'Upload photos' },
                    { icon: MapPin, text: 'Track locations' },
                    { icon: Sparkles, text: 'Add memories' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                      <item.icon className="h-4 w-4 text-primary" />
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-medium shadow-lg hover:shadow-xl transition-all">
                    <Link href="/auth">
                      <Plane className="mr-2 h-5 w-5" />
                      Sign In to Get Started
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                    <Link href="/community">
                      Explore Community First
                    </Link>
                  </Button>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  Free forever • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayEntries = journeys.map((j, index) => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    notes: j.body || '',
    mustDos: j.tags || [],
    author: 'You',
    likes: j.likes_count || 0,
    rotation: (index % 2 ? -1 : 1) * (Math.random() * 2)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-text)] mb-4">My Travel Scrapbook</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your personal collection of travel memories and adventures
          </p>
        </div>

        <div className="mb-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ fontFamily: 'Permanent Marker, cursive' }}
          >
            <Plus size={20} />
            <span>Add New Entry</span>
          </button>
        </div>

        {loading && journeys.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : displayEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {displayEntries.map((entry) => (
              <TravelEntry key={entry.id} {...entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white p-12 rounded-3xl shadow-lg max-w-md mx-auto border-4 border-dashed border-gray-200">
              <Plane className="mx-auto text-[var(--color-secondary)] mb-6" size={64} />
              <h3 className="text-gray-700 mb-3" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                Your scrapbook is empty!
              </h3>
              <p className="text-gray-500 mb-8">
                Start documenting your amazing travel adventures.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} />
                <span>Create First Entry</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEntry}
        loading={mutationLoading}
      />
    </div>
  );
}
