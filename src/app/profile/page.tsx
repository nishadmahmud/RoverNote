'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Camera, MapPin, Calendar, Award, Edit2, Save, Plane, Loader2, Upload } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/hooks/useAuth';
import { useMyJourneys } from '@/hooks/useJourneys';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, profile, loading: authLoading, updateProfile, uploadAvatar } = useAuth();
  const { journeys } = useMyJourneys(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editedProfile, setEditedProfile] = useState({
    display_name: '',
    bio: '',
    location: '',
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    const { error } = await uploadAvatar(file);
    
    if (error) {
      toast.error('Failed to upload avatar: ' + error.message);
    } else {
      toast.success('Avatar updated! 🎉');
    }
    setUploadingAvatar(false);
  };

  const handleStartEdit = () => {
    setEditedProfile({
      display_name: profile?.display_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
    });
    setIsEditing(true);
  };

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

  const uniqueCountries = [...new Set(journeys.map(j => j.country).filter(Boolean))];
  const totalLikes = journeys.reduce((sum, j) => sum + (j.likes_count || 0), 0);

  const stats = [
    { label: 'Entries', value: journeys.length, icon: Camera, color: 'from-[var(--color-primary)] to-[#ff5252]' },
    { label: 'Countries', value: uniqueCountries.length, icon: MapPin, color: 'from-[var(--color-secondary)] to-[#45b8b0]' },
    { label: 'Likes', value: totalLikes, icon: Award, color: 'from-[var(--color-accent)] to-[#ffd93d]' }
  ];

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg)] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-4 border-[var(--color-paper)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-secondary)]/20 to-[var(--color-primary)]/20 rounded-full blur-3xl -z-0"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <ImageWithFallback
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=160`}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Avatar upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <div className="text-center text-white">
                      <Camera className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-xs">Change Photo</span>
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
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
                    <h2 className="text-[var(--color-text)] mb-2">{displayName}</h2>
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
            <h3 className="text-[var(--color-text)] mb-6">Countries I&apos;ve Explored</h3>
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
      </div>
    </div>
  );
}
