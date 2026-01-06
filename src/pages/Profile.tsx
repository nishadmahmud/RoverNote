import { useState } from 'react';
import { Camera, MapPin, Calendar, Award, Edit2, Save, Map, Loader2, Plane } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMyJourneys } from '../hooks/useJourneys';
import { supabase, STORAGE_BUCKET, getImageUrl } from '../lib/supabase';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const { journeys, loading: journeysLoading } = useMyJourneys();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    display_name: '',
    bio: '',
    location: '',
  });

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Start editing
  const handleStartEdit = () => {
    setEditedProfile({
      display_name: profile?.display_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
    });
    setIsEditing(true);
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(editedProfile);
    
    if (error) {
      toast.error('Failed to update profile: ' + error.message);
    } else {
      toast.success('Profile updated! 🎉');
      setIsEditing(false);
    }
    setSaving(false);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${user.id}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload avatar');
      return;
    }

    // Update profile with new avatar URL
    const avatarUrl = getImageUrl(fileName);
    const { error } = await updateProfile({ avatar_url: avatarUrl });
    
    if (error) {
      toast.error('Failed to update avatar');
    } else {
      toast.success('Avatar updated! 📸');
    }
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="bg-white p-12 rounded-3xl shadow-lg max-w-md mx-auto border-4 border-dashed border-gray-200">
              <Plane className="mx-auto text-[var(--color-primary)] mb-6" size={64} />
              <h3 className="text-gray-700 mb-3" style={{ fontFamily: 'Permanent Marker, cursive' }}>
                Sign In to View Your Profile
              </h3>
              <p className="text-gray-500 mb-8">
                Create an account to start your travel journey!
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
  if (authLoading || journeysLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  // Calculate stats
  const uniqueCountries = [...new Set(journeys.map(j => j.country).filter(Boolean))];
  const totalLikes = journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0);

  // Transform journeys for map
  const mapEntries = journeys.map(j => ({
    id: j.id,
    location: j.location || j.title,
    country: j.country || '',
    date: formatDate(j.start_date),
    image: j.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    author: profile?.display_name || 'You',
    likes: j.likes_count || 0
  }));

  const stats = [
    { label: 'Entries', value: journeys.length, icon: Camera, color: 'from-[var(--color-primary)] to-[#ff5252]' },
    { label: 'Countries Visited', value: uniqueCountries.length, icon: MapPin, color: 'from-[var(--color-secondary)] to-[#45b8b0]' },
    { label: 'Total Likes', value: totalLikes, icon: Award, color: 'from-[var(--color-accent)] to-[#ffd93d]' }
  ];

  const badges = [
    { name: 'Early Explorer', description: 'Joined RoverNote', emoji: '🌟', earned: true },
    { name: 'Photo Master', description: '10+ entries with photos', emoji: '📸', earned: journeys.length >= 10 },
    { name: 'Globetrotter', description: 'Visited 5+ countries', emoji: '🌍', earned: uniqueCountries.length >= 5 },
    { name: 'Community Star', description: '100+ likes received', emoji: '⭐', earned: totalLikes >= 100 }
  ];

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-4 border-[var(--color-paper)] relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-secondary)]/20 to-[var(--color-primary)]/20 rounded-full blur-3xl -z-0"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <ImageWithFallback
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || 'User')}&background=random&size=160`}
                    alt={profile?.display_name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-2 right-2 bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedProfile.display_name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, display_name: e.target.value })}
                      placeholder="Display Name"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[var(--color-secondary)] focus:outline-none"
                    />
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[var(--color-secondary)] focus:outline-none resize-none"
                    />
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      placeholder="Your location"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[var(--color-secondary)] focus:outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-[var(--color-text)] mb-2">{profile?.display_name || 'Traveler'}</h2>
                    <p className="text-gray-600 mb-4">{profile?.bio || 'No bio yet. Tell us about your travel adventures!'}</p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                      {profile?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[var(--color-secondary)]" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[var(--color-primary)]" />
                        <span>Joined {memberSince}</span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="mt-6">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[var(--color-secondary)] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mx-auto md:mx-0 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mx-auto md:mx-0"
                    >
                      <Edit2 size={20} />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg text-white`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={32} />
                  <div className="text-right" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '2rem' }}>{stat.value}</div>
                </div>
                <p className="text-sm text-white/90">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Countries Visited */}
        {uniqueCountries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-4 border-[var(--color-paper)]">
            <h3 className="text-[var(--color-text)] mb-6">Countries I've Explored</h3>
            <div className="flex flex-wrap gap-3">
              {uniqueCountries.map((country, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 rounded-full border-2 border-[var(--color-secondary)]/30 text-gray-700 hover:scale-105 transition-transform cursor-pointer"
                >
                  {country}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Map */}
        {mapEntries.length > 0 && (
          <div className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[var(--color-text)]" style={{ fontFamily: 'Caveat, cursive' }}>
                🗺️ My Travel Journey
              </h3>
              <Link
                to="/map"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-full hover:shadow-lg transition-all"
                style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '0.9rem' }}
              >
                <Map size={18} />
                <span>Full Map View</span>
              </Link>
            </div>
            <InteractiveWorldMap 
              entries={mapEntries} 
              showRoutes={true}
              showHeatmap={false}
              personalMode={true}
            />
          </div>
        )}

        {/* Badges */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-[var(--color-paper)]">
          <h3 className="text-[var(--color-text)] mb-6">Achievements & Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-6 rounded-xl border-2 transition-shadow ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-[var(--color-bg)] to-white border-[var(--color-accent)]/30 hover:shadow-lg' 
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-4xl">{badge.emoji}</div>
                <div>
                  <h4 className="text-[var(--color-text)] mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  {!badge.earned && <p className="text-xs text-gray-400 mt-1">Not yet earned</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
