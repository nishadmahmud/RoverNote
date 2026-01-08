'use client';

import { Loader2, Map } from 'lucide-react';
import Link from 'next/link';
import { useCommunityJourneys } from '@/hooks/useJourneys';

export default function MapPage() {
  const { journeys, loading } = useCommunityJourneys();

  const uniqueCountries = [...new Set(journeys.map(j => j.country).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-text)] mb-4">World Travel Map</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore destinations visited by our community of travelers
          </p>
        </div>

        {/* Placeholder Map */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-4 border-[var(--color-paper)]">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Map className="mx-auto text-[var(--color-secondary)] mb-4" size={64} />
              <p className="text-gray-600 mb-2">Interactive map coming soon!</p>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
              ) : (
                <p className="text-sm text-gray-500">
                  {journeys.length} stories from {uniqueCountries.length} countries
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Countries List */}
        {uniqueCountries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-[var(--color-paper)]">
            <h3 className="text-[var(--color-text)] mb-6">Countries Explored</h3>
            <div className="flex flex-wrap gap-3">
              {uniqueCountries.map((country, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 rounded-full border-2 border-[var(--color-secondary)]/30 text-gray-700"
                >
                  {country}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            View All Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
