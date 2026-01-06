import { useState, useEffect, useCallback } from 'react';
import { supabase, STORAGE_BUCKET, getImageUrl } from '../lib/supabase';
import type { Journey, JourneyInsert, JourneyWithProfile } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

// Fetch all public journeys (for community page)
export function useCommunityJourneys() {
  const [journeys, setJourneys] = useState<JourneyWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJourneys = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, try with the join
      const { data, error: joinError } = await supabase
        .from('journeys')
        .select(`
          *,
          profiles (display_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (joinError) {
        // Fallback: fetch without join if relationship fails
        console.warn('Join query failed, using fallback:', joinError.message);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('journeys')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          setError(fallbackError.message);
        } else {
          // Add empty profiles object
          setJourneys((fallbackData || []).map(j => ({ ...j, profiles: null })));
        }
      } else {
        setJourneys(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  return { journeys, loading, error, refetch: fetchJourneys };
}

// Fetch user's own journeys (for my scrapbook page)
export function useMyJourneys() {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJourneys = useCallback(async () => {
    if (!user) {
      setJourneys([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setJourneys(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  return { journeys, loading, error, refetch: fetchJourneys };
}

// Fetch single journey by ID
export function useJourney(id: string | undefined) {
  const [journey, setJourney] = useState<JourneyWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchJourney = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, try with the join
        const { data, error: joinError } = await supabase
          .from('journeys')
          .select(`
            *,
            profiles (display_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (joinError) {
          // Fallback: fetch without join
          console.warn('Join query failed, using fallback:', joinError.message);
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('journeys')
            .select('*')
            .eq('id', id)
            .single();
          
          if (fallbackError) {
            setError(fallbackError.message);
          } else {
            setJourney(fallbackData ? { ...fallbackData, profiles: null } : null);
          }
        } else {
          setJourney(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
      
      setLoading(false);
    };

    fetchJourney();
  }, [id]);

  return { journey, loading, error };
}

// Journey mutations
export function useJourneyMutations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Upload image to storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return fileName;
  };

  // Create journey
  const createJourney = async (
    journey: Omit<JourneyInsert, 'user_id'>,
    imageFile?: File
  ) => {
    if (!user) return { error: new Error('Not authenticated'), data: null };

    setLoading(true);
    let imagePath: string | null = null;
    let imageUrl: string | null = journey.image_url || null;

    // Upload image if provided
    if (imageFile) {
      imagePath = await uploadImage(imageFile);
      if (imagePath) {
        imageUrl = getImageUrl(imagePath);
      }
    }

    const { data, error } = await supabase
      .from('journeys')
      .insert({
        ...journey,
        user_id: user.id,
        image_path: imagePath,
        image_url: imageUrl,
      })
      .select()
      .single();

    setLoading(false);
    return { data, error: error ? new Error(error.message) : null };
  };

  // Update journey
  const updateJourney = async (
    id: string,
    updates: Partial<Journey>,
    newImageFile?: File
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    setLoading(true);
    let updateData = { ...updates, updated_at: new Date().toISOString() };

    // Upload new image if provided
    if (newImageFile) {
      const imagePath = await uploadImage(newImageFile);
      if (imagePath) {
        updateData = {
          ...updateData,
          image_path: imagePath,
          image_url: getImageUrl(imagePath),
        };
      }
    }

    const { error } = await supabase
      .from('journeys')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    setLoading(false);
    return { error: error ? new Error(error.message) : null };
  };

  // Delete journey
  const deleteJourney = async (id: string, imagePath?: string | null) => {
    if (!user) return { error: new Error('Not authenticated') };

    setLoading(true);

    // Delete image from storage if exists
    if (imagePath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([imagePath]);
    }

    const { error } = await supabase
      .from('journeys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    setLoading(false);
    return { error: error ? new Error(error.message) : null };
  };

  // Like journey (increment likes_count)
  const likeJourney = async (id: string) => {
    const { error } = await supabase.rpc('increment_likes', { journey_id: id });
    return { error: error ? new Error(error.message) : null };
  };

  return {
    createJourney,
    updateJourney,
    deleteJourney,
    likeJourney,
    loading,
  };
}
