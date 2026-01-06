import { useState } from 'react';
import { Plus, Plane, BookOpen, Loader2 } from 'lucide-react';
import { TravelEntry } from '../components/TravelEntry';
import { AddEntryModal } from '../components/AddEntryModal';
import { useMyJourneys, useJourneyMutations } from '../hooks/useJourneys';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function MyScrapbook() {
  const { user, loading: authLoading } = useAuth();
  const { journeys, loading, refetch } = useMyJourneys();
  const { createJourney, loading: mutationLoading } = useJourneyMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEntry = async (newEntry: {
    location: string;
    country: string;
    date: string;
    image: string;
    notes: string;
    mustDos: string[];
    imageFile?: File;
  }) => {
    const { error } = await createJourney(
      {
        title: newEntry.location,
        location: newEntry.location,
        country: newEntry.country,
        start_date: newEntry.date,
        body: newEntry.notes,
        tags: newEntry.mustDos,
        image_url: newEntry.imageFile ? undefined : newEntry.image,
        is_public: true,
      },
      newEntry.imageFile
    );

    if (error) {
      toast.error('Failed to add entry: ' + error.message);
    } else {
      toast.success('Journey added to your scrapbook! 🎉');
      refetch();
      setIsModalOpen(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="bg-white p-12 rounded-3xl shadow-lg max-w-md mx-auto border-4 border-dashed border-gray-200">
              <BookOpen className="mx-auto text-[var(--color-primary)] mb-6" size={64} />
              <h3 className="text-gray-700 mb-3" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                Sign In to Start Your Scrapbook
              </h3>
              <p className="text-gray-500 mb-8">
                Create an account to start documenting your travel adventures!
              </p>
              <Link
                to="/auth"
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

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  // Calculate stats
  const uniqueCountries = new Set(journeys.map(j => j.country).filter(Boolean));
  const totalLikes = journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0);
  const totalMustDos = journeys.reduce((sum, j) => sum + (j.tags?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="text-[var(--color-primary)]" size={48} />
          </div>
          <h2 className="text-[var(--color-text)] mb-4">My Travel Scrapbook</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your personal collection of adventures and memories from around the world
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#ff5252] p-6 rounded-2xl shadow-lg text-white text-center">
            <div className="mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '2rem' }}>{journeys.length}</div>
            <p className="text-sm text-white/90">Entries</p>
          </div>
          <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[#45b8b0] p-6 rounded-2xl shadow-lg text-white text-center">
            <div className="mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '2rem' }}>{uniqueCountries.size}</div>
            <p className="text-sm text-white/90">Countries</p>
          </div>
          <div className="bg-gradient-to-br from-[var(--color-accent)] to-[#ffd93d] p-6 rounded-2xl shadow-lg text-white text-center">
            <div className="mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '2rem' }}>{totalLikes}</div>
            <p className="text-sm text-white/90">Total Likes</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-2xl shadow-lg text-white text-center">
            <div className="mb-1" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '2rem' }}>{totalMustDos}</div>
            <p className="text-sm text-white/90">Must Do's</p>
          </div>
        </div>

        {/* Add Entry Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={mutationLoading}
            className="flex items-center gap-3 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {mutationLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Plus size={24} />
            )}
            <span>Add New Entry</span>
          </button>
        </div>

        {/* Entries Grid */}
        {journeys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {journeys.map((journey, index) => (
              <TravelEntry
                key={journey.id}
                id={journey.id}
                location={journey.location || journey.title}
                country={journey.country || ''}
                date={formatDate(journey.start_date)}
                image={journey.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                notes={journey.body || ''}
                mustDos={journey.tags || []}
                author="You"
                likes={journey.likes_count || 0}
                rotation={(index % 2 ? -1 : 1) * (Math.random() * 2)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white p-12 rounded-3xl shadow-lg max-w-md mx-auto border-4 border-dashed border-gray-200">
              <Plane className="mx-auto text-gray-300 mb-6" size={64} />
              <h3 className="text-gray-700 mb-3">Your Scrapbook is Empty</h3>
              <p className="text-gray-500 mb-8">
                Start documenting your adventures! Add your first travel entry to begin your journey.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} />
                <span>Add Your First Entry</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
}
