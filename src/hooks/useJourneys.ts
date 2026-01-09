'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Journey {
  id: string;
  user_id: string;
  title: string;
  location: string | null;
  country: string | null;
  start_date: string | null;
  end_date: string | null;
  body: string | null;
  image_url: string | null;
  image_path: string | null;
  additional_images: string[] | null; // NEW: 4 additional images
  tags: string[] | null;
  is_public: boolean;
  likes_count: number;
  created_at: string | null;
  updated_at: string | null;
}

interface JourneyInsert {
  title: string;
  location?: string | null;
  country?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  body?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  additional_images?: string[] | null; // NEW
  tags?: string[] | null;
  is_public?: boolean;
}

// Extended journey type with profiles
interface JourneyWithProfile extends Journey {
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

// Simple hook - just fetches public journeys with profiles
export function useCommunityJourneys() {
  const [journeys, setJourneys] = useState<JourneyWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    supabase
      .from('journeys')
      .select(`
        id,
        user_id,
        title,
        location,
        country,
        start_date,
        end_date,
        body,
        image_url,
        image_path,
        additional_images,
        tags,
        is_public,
        likes_count,
        created_at,
        updated_at,
        profiles (
          display_name,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching journeys:', error.message || error);
          setError(error.message || 'Failed to fetch journeys');
        } else {
          setJourneys((data || []) as JourneyWithProfile[]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Network error:', err);
        setError('Network error');
        setLoading(false);
      });
  }, []);

  return { journeys, loading, error };
}

// Simple hook - fetches user's journeys
export function useMyJourneys(userId: string | undefined) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setJourneys([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    
    supabase
      .from('journeys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setJourneys(data || []);
        setLoading(false);
      });
  }, [userId]);

  const refetch = () => {
    if (!userId) return;
    
    setLoading(true);
    const supabase = createClient();
    
    supabase
      .from('journeys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setJourneys(data || []);
        setLoading(false);
      });
  };

  return { journeys, loading, error, refetch };
}

// Keep old hook for backward compatibility
export function useJourneys(options: { userId?: string; isPublic?: boolean } = {}) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No options = no fetch needed
    if (!options.userId && !options.isPublic) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    let query = supabase
      .from('journeys')
      .select('*')
      .order('created_at', { ascending: false });

    if (options.userId) {
      query = query.eq('user_id', options.userId);
    } else if (options.isPublic) {
      query = query.eq('is_public', true);
    }

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setJourneys(data || []);
      setLoading(false);
    });
  }, [options.userId, options.isPublic]);

  const refetch = () => {
    if (!options.userId && !options.isPublic) return;
    
    setLoading(true);
    const supabase = createClient();
    
    let query = supabase
      .from('journeys')
      .select('*')
      .order('created_at', { ascending: false });

    if (options.userId) {
      query = query.eq('user_id', options.userId);
    } else if (options.isPublic) {
      query = query.eq('is_public', true);
    }

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setJourneys(data || []);
      setLoading(false);
    });
  };

  return { journeys, loading, error, refetch };
}

export function useJourneyMutations() {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File, userId: string): Promise<string | null> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('journey-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('journey-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Upload multiple images
  const uploadMultipleImages = async (files: File[], userId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file, userId);
      if (url) urls.push(url);
    }
    return urls;
  };

  const createJourney = async (
    journey: JourneyInsert, 
    mainImageFile?: File,
    additionalImageFiles?: File[]
  ) => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return { error: new Error('Not authenticated'), data: null };
    }

    // Upload main image
    let imageUrl = journey.image_url || null;
    let imagePath: string | null = null;

    if (mainImageFile) {
      imageUrl = await uploadImage(mainImageFile, user.id);
      imagePath = imageUrl;
    }

    // Upload additional images (up to 4)
    let additionalImages: string[] = journey.additional_images || [];
    if (additionalImageFiles && additionalImageFiles.length > 0) {
      const uploadedUrls = await uploadMultipleImages(additionalImageFiles, user.id);
      additionalImages = [...additionalImages, ...uploadedUrls].slice(0, 4); // Max 4
    }

    const { data, error } = await supabase
      .from('journeys')
      .insert({
        ...journey,
        user_id: user.id,
        image_url: imageUrl,
        image_path: imagePath,
        additional_images: additionalImages.length > 0 ? additionalImages : null,
      })
      .select()
      .single();

    setLoading(false);
    return { data, error: error ? new Error(error.message) : null };
  };

  const updateJourney = async (
    id: string, 
    updates: Partial<Journey>, 
    newMainImageFile?: File,
    newAdditionalImageFiles?: File[]
  ) => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return { error: new Error('Not authenticated') };
    }

    let updateData: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };

    if (newMainImageFile) {
      const imageUrl = await uploadImage(newMainImageFile, user.id);
      if (imageUrl) {
        updateData = { ...updateData, image_url: imageUrl, image_path: imageUrl };
      }
    }

    if (newAdditionalImageFiles && newAdditionalImageFiles.length > 0) {
      const uploadedUrls = await uploadMultipleImages(newAdditionalImageFiles, user.id);
      const existingAdditional = (updates.additional_images || []) as string[];
      updateData.additional_images = [...existingAdditional, ...uploadedUrls].slice(0, 4);
    }

    const { error } = await supabase
      .from('journeys')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    setLoading(false);
    return { error: error ? new Error(error.message) : null };
  };

  const deleteJourney = async (id: string) => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('journeys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    setLoading(false);
    return { error: error ? new Error(error.message) : null };
  };

  const likeJourney = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.rpc('increment_likes', { journey_id: id });
    return { error: error ? new Error(error.message) : null };
  };

  return { createJourney, updateJourney, deleteJourney, likeJourney, uploadImage, uploadMultipleImages, loading };
}
