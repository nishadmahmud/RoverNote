'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ error: Error | null; url: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    // Set a timeout - don't wait more than 3 seconds for auth
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('Auth timeout - setting loading to false');
        setLoading(false);
      }
    }, 3000);

    // Get user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      console.log('Got user:', user?.email);
      setUser(user);
      setLoading(false);
      clearTimeout(timeout);
      
      // Profile fetch in background
      if (user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (mounted && data) {
              console.log('Got profile:', data.display_name);
              // Use Google avatar if no profile avatar
              const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
              if (!data.avatar_url && googleAvatar) {
                data.avatar_url = googleAvatar;
                // Update profile with Google avatar
                supabase.from('profiles').update({ avatar_url: googleAvatar }).eq('id', user.id);
              }
              setProfile(data);
            }
          });
      }
    }).catch(err => {
      console.error('Auth error:', err);
      if (mounted) setLoading(false);
      clearTimeout(timeout);
    });

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      console.log('Auth state change:', event);
      
      const newUser = session?.user ?? null;
      setUser(newUser);
      setLoading(false);
      
      if (!newUser) {
        setProfile(null);
      } else if (event === 'SIGNED_IN') {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.id)
          .single()
          .then(({ data }) => {
            if (mounted && data) setProfile(data);
          });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (!error && data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        display_name: displayName,
      });
    }

    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    console.log('Signing out...');
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    console.log('Signed out');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }

    return { error: error ? new Error(error.message) : null };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error('Not authenticated'), url: null };

    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${user.id}.${fileExt}`;

    // Upload to storage (using journey-images bucket)
    const { error: uploadError } = await supabase.storage
      .from('journey-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return { error: new Error(uploadError.message), url: null };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('journey-images')
      .getPublicUrl(fileName);

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!updateError) {
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
    }

    return { error: updateError ? new Error(updateError.message) : null, url: publicUrl };
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updateProfile,
      uploadAvatar,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
