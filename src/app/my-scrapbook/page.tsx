'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Plane, Loader2 } from 'lucide-react';
import { TravelEntry } from '@/components/TravelEntry';
import { AddEntryModal } from '@/components/AddEntryModal';
import { useAuth } from '@/hooks/useAuth';
import { useMyJourneys, useJourneyMutations } from '@/hooks/useJourneys';
import { toast } from 'sonner';

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
        <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="bg-white p-12 rounded-3xl shadow-lg max-w-md mx-auto border-4 border-dashed border-gray-200">
              <Plane className="mx-auto text-[var(--color-primary)] mb-6" size={64} />
              <h3 className="text-gray-700 mb-3" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                Sign In to View Your Scrapbook
              </h3>
              <p className="text-gray-500 mb-8">
                Create an account to start your travel journey!
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Plane size={20} />
                <span>Sign In / Register</span>
              </Link>
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
