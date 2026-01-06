import { useState, useMemo } from 'react';
import { Search, Filter, Map, Loader2 } from 'lucide-react';
import { TravelEntry } from '../components/TravelEntry';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { Link } from 'react-router-dom';
import { useCommunityJourneys } from '../hooks/useJourneys';

export function Community() {
  const { journeys, loading, error } = useCommunityJourneys();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Filter entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return journeys;
    
    const query = searchQuery.toLowerCase();
    return journeys.filter(entry =>
      entry.location?.toLowerCase().includes(query) ||
      entry.country?.toLowerCase().includes(query) ||
      entry.profiles?.display_name?.toLowerCase().includes(query)
    );
  }, [journeys, searchQuery]);

  // Transform journeys for TravelEntry component
  const displayEntries = filteredEntries.map((j, index) => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    notes: j.body || '',
    mustDos: j.tags || [],
    author: j.profiles?.display_name || 'Anonymous Traveler',
    likes: j.likes_count || 0,
    rotation: (index % 2 ? -1 : 1) * (Math.random() * 2)
  }));

  // Transform for map component
  const mapEntries = filteredEntries.map(j => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    author: j.profiles?.display_name || 'Anonymous Traveler',
    likes: j.likes_count || 0
  }));

  // Calculate stats
  const uniqueCountries = new Set(journeys.map(j => j.country).filter(Boolean));
  const totalLikes = journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

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
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-text)] mb-4">Community Travel Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing travel experiences shared by fellow adventurers from around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex gap-4 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by location, country, or author..."
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

        {/* Stats */}
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

        {/* Map Toggle Section */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowMap(!showMap)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            style={{ fontFamily: 'Permanent Marker, cursive' }}
          >
            <Map size={20} />
            <span>{showMap ? 'Hide Map' : 'View World Map'}</span>
          </button>
          {!showMap && (
            <Link
              to="/map"
              className="ml-4 inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              style={{ fontFamily: 'Permanent Marker, cursive' }}
            >
              <span>Full Map Experience</span>
            </Link>
          )}
        </div>

        {/* Inline Map View */}
        {showMap && mapEntries.length > 0 && (
          <div className="mb-12">
            <InteractiveWorldMap 
              entries={mapEntries} 
              showRoutes={true}
              showHeatmap={true}
              personalMode={false}
            />
          </div>
        )}

        {/* Entries Grid */}
        {displayEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {displayEntries.map((entry) => (
              <TravelEntry key={entry.id} {...entry} />
            ))}
          </div>
        ) : journeys.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No travel stories yet!</p>
            <p className="text-gray-400">Be the first to share your adventure.</p>
            <Link
              to="/my-scrapbook"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Share Your Story
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No stories found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
