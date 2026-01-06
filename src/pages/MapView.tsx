import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { MapPin, Route, TrendingUp, Users, User, Loader2 } from 'lucide-react';
import { useCommunityJourneys, useMyJourneys } from '../hooks/useJourneys';
import { useAuth } from '../contexts/AuthContext';

interface TravelEntry {
  id: string;
  location: string;
  country: string;
  date: string;
  image: string;
  author: string;
  likes: number;
}

export function MapView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { journeys: communityJourneys, loading: communityLoading } = useCommunityJourneys();
  const { journeys: myJourneys, loading: myLoading } = useMyJourneys();
  const [viewMode, setViewMode] = useState<'community' | 'personal'>('community');
  const [showRoutes, setShowRoutes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Transform journeys to map entries
  const communityEntries: TravelEntry[] = communityJourneys.map(j => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    author: j.profiles?.display_name || 'Anonymous Traveler',
    likes: j.likes_count || 0
  }));

  const personalEntries: TravelEntry[] = myJourneys.map(j => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    author: 'You',
    likes: j.likes_count || 0
  }));

  const displayEntries = viewMode === 'community' ? communityEntries : personalEntries;
  const loading = viewMode === 'community' ? communityLoading : myLoading;

  const handleMarkerClick = (entry: TravelEntry) => {
    navigate(`/journey/${entry.id}`);
  };

  // Calculate stats
  const mostPopular = displayEntries.length > 0 
    ? displayEntries.reduce((max, e) => e.likes > max.likes ? e : max, displayEntries[0])
    : null;
  const uniqueCountries = new Set(displayEntries.map(e => e.country).filter(Boolean));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with decorative elements */}
        <div className="text-center mb-8 relative">
          {/* Decorative plane doodle */}
          <div className="absolute -top-4 left-1/4 transform -rotate-12">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path d="M 10 30 L 30 20 L 50 30 L 30 25 Z" fill="#FF6B6B" opacity="0.3" />
              <circle cx="35" cy="28" r="2" fill="#FFC857" />
            </svg>
          </div>
          
          <div className="inline-block relative">
            <h2 className="text-[var(--color-text)] mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
              🗺️ Explore the World
            </h2>
            {/* Handwritten underline */}
            <svg className="w-64 h-4 mx-auto" viewBox="0 0 250 10">
              <path d="M 5 5 Q 60 8, 125 5 T 245 5" stroke="var(--color-secondary)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {viewMode === 'community' 
              ? 'Discover where fellow travelers have been around the globe' 
              : 'Your personal travel journey mapped out'}
          </p>

          {/* Decorative stamp */}
          <div className="absolute -top-2 right-1/4 transform rotate-12">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#4ECDC4" strokeWidth="2" opacity="0.5"/>
              <text x="25" y="28" textAnchor="middle" fill="#4ECDC4" fontSize="8" fontFamily="Permanent Marker" opacity="0.6">
                MAP
              </text>
            </svg>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-4 border-[var(--color-accent)]">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('community')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all transform hover:scale-105 ${
                  viewMode === 'community'
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Permanent Marker, cursive' }}
              >
                <Users size={20} />
                <span>Community</span>
              </button>
              {user && (
                <button
                  onClick={() => setViewMode('personal')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all transform hover:scale-105 ${
                    viewMode === 'personal'
                      ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Permanent Marker, cursive' }}
                >
                  <User size={20} />
                  <span>My Travels</span>
                </button>
              )}
            </div>

            {/* Map Options */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  showRoutes
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                <Route size={18} />
                <span className="text-sm">Routes</span>
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  showHeatmap
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                <TrendingUp size={18} />
                <span className="text-sm">Heatmap</span>
              </button>
            </div>
          </div>
        </div>

        {/* World Map Component */}
        {displayEntries.length > 0 ? (
          <InteractiveWorldMap
            entries={displayEntries}
            onMarkerClick={handleMarkerClick}
            showRoutes={showRoutes}
            showHeatmap={showHeatmap}
            personalMode={viewMode === 'personal'}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-4 border-[var(--color-accent)]">
            <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 mb-2">No journeys to display on the map</p>
            <p className="text-gray-400 text-sm">
              {viewMode === 'personal' 
                ? 'Start adding entries to see your travels on the map!' 
                : 'Be the first to share your travel adventures!'}
            </p>
          </div>
        )}

        {/* Fun Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Popular Destination */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 p-6 rounded-2xl shadow-lg border-2 border-pink-300 transform -rotate-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-pink-400 p-2 rounded-full">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 style={{ fontFamily: 'Permanent Marker, cursive' }} className="text-pink-800">
                🏆 Most Popular
              </h3>
            </div>
            <p className="text-2xl font-bold text-pink-700 mb-1">{mostPopular?.location || 'N/A'}</p>
            <p className="text-sm text-pink-600">{mostPopular ? `${mostPopular.likes} likes from travelers` : 'No entries yet'}</p>
          </div>

          {/* Total Destinations */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-lg border-2 border-blue-300 transform rotate-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-400 p-2 rounded-full">
                <Route size={24} className="text-white" />
              </div>
              <h3 style={{ fontFamily: 'Permanent Marker, cursive' }} className="text-blue-800">
                ✈️ Destinations
              </h3>
            </div>
            <p className="text-2xl font-bold text-blue-700 mb-1">
              {displayEntries.length}
            </p>
            <p className="text-sm text-blue-600">Places explored</p>
          </div>

          {/* Continents Visited */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-lg border-2 border-green-300 transform -rotate-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-400 p-2 rounded-full">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 style={{ fontFamily: 'Permanent Marker, cursive' }} className="text-green-800">
                🌍 Countries
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-700 mb-1">
              {uniqueCountries.size}
            </p>
            <p className="text-sm text-green-600">Keep exploring!</p>
          </div>
        </div>

        {/* Inspirational Quote Card */}
        <div className="mt-8 bg-[var(--color-paper)] p-8 rounded-2xl shadow-xl border-4 border-[var(--color-secondary)] relative overflow-hidden">
          {/* Decorative washi tape */}
          <div className="absolute top-0 left-12 w-32 h-6 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-60 transform -rotate-3" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.3) 10px, rgba(255,255,255,.3) 20px)'
            }}
          />
          
          <blockquote className="text-center">
            <p className="text-2xl text-[var(--color-primary)] mb-4" style={{ fontFamily: 'Caveat, cursive', lineHeight: '1.6' }}>
              "The world is a book, and those who do not travel read only one page."
            </p>
            <footer className="text-gray-600" style={{ fontFamily: 'Kalam, cursive' }}>
              — Saint Augustine
            </footer>
          </blockquote>

          {/* Decorative sticker */}
          <div className="absolute bottom-4 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center transform rotate-12 shadow-md">
            <span className="text-3xl">🌟</span>
          </div>
        </div>
      </div>
    </div>
  );
}
