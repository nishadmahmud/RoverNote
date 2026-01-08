'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Map, Loader2 } from 'lucide-react';
import { TravelEntry } from '@/components/TravelEntry';
import Link from 'next/link';
import { useCommunityJourneys } from '@/hooks/useJourneys';

export default function CommunityPage() {
  const { journeys, loading, error } = useCommunityJourneys();
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return journeys;
    
    const query = searchQuery.toLowerCase();
    return journeys.filter(entry =>
      entry.location?.toLowerCase().includes(query) ||
      entry.country?.toLowerCase().includes(query)
    );
  }, [journeys, searchQuery]);

  const displayEntries = filteredEntries.map((j, index) => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    notes: j.body || '',
    mustDos: j.tags || [],
    author: 'Anonymous Traveler',
    likes: j.likes_count || 0,
    rotation: (index % 2 ? -1 : 1) * (Math.random() * 2)
  }));

  const uniqueCountries = new Set(journeys.map(j => j.country).filter(Boolean));
  const totalLikes = journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load community stories</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-text)] mb-4">Community Travel Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing travel experiences shared by fellow adventurers from around the world
          </p>
        </div>

        <div className="mb-8 flex gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by location or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--color-secondary)] focus:outline-none transition-colors bg-white shadow-md"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 bg-white hover:border-[var(--color-secondary)] transition-colors shadow-md">
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-2 border-[var(--color-primary)]">
            <div className="text-[var(--color-primary)] mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.5rem' }}>
              {journeys.length}
            </div>
            <p className="text-gray-600 text-sm">Stories</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-2 border-[var(--color-secondary)]">
            <div className="text-[var(--color-secondary)] mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.5rem' }}>
              {uniqueCountries.size}
            </div>
            <p className="text-gray-600 text-sm">Countries</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-2 border-[var(--color-accent)]">
            <div className="text-[var(--color-accent)] mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.5rem' }}>
              {totalLikes}
            </div>
            <p className="text-gray-600 text-sm">Likes</p>
          </div>
        </div>

        <div className="mb-8 text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ fontFamily: 'Permanent Marker, cursive' }}
          >
            <Map size={20} />
            <span>View World Map</span>
          </Link>
        </div>

        {loading ? (
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
            <p className="text-gray-500 mb-4">No travel stories yet!</p>
            <p className="text-gray-400">Be the first to share your adventure.</p>
            <Link
              href="/my-scrapbook"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Share Your Story
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
