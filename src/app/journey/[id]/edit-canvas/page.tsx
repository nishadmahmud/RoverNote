'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { CanvasData, createBlankCanvas } from '@/types/canvas';
import { useAuth } from '@/hooks/useAuth';
import { JourneyCanvas } from '@/components/canvas';

interface Journey {
  id: string;
  user_id: string;
  title: string;
  location: string | null;
  country: string | null;
  canvas_data: CanvasData | null;
}

export default function EditCanvasPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const fetchJourney = async () => {
      if (!params.id) {
        setError('Journey ID not found');
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('journeys')
        .select('id, user_id, title, location, country, canvas_data')
        .eq('id', params.id)
        .single();

      if (fetchError || !data) {
        setError('Journey not found');
        setLoading(false);
        return;
      }

      setJourney(data);
      setLoading(false);
    };

    fetchJourney();
  }, [params.id]);

  // Check if user owns this journey
  const isOwner = user && journey && user.id === journey.user_id;

  const handleSave = async (canvasData: CanvasData) => {
    if (!journey || !isOwner) return;

    setSaveStatus('saving');
    
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('journeys')
      .update({ 
        canvas_data: canvasData,
        updated_at: new Date().toISOString()
      })
      .eq('id', journey.id)
      .eq('user_id', user!.id);

    if (updateError) {
      console.error('Error saving canvas:', updateError);
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  // Error state
  if (error || !journey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 style={{ fontFamily: 'Permanent Marker, cursive' }} className="text-2xl text-gray-800 mb-2">
            Oops!
          </h2>
          <p style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-600 mb-4">
            {error || 'Journey not found'}
          </p>
          <Link
            href="/my-scrapbook"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            <ArrowLeft size={20} />
            Back to My Scrapbook
          </Link>
        </div>
      </div>
    );
  }

  // Not owner
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 style={{ fontFamily: 'Permanent Marker, cursive' }} className="text-2xl text-gray-800 mb-2">
            Not Authorized
          </h2>
          <p style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-600 mb-4">
            You can only edit your own journeys.
          </p>
          <Link
            href={`/journey/${journey.id}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            <ArrowLeft size={20} />
            View Journey
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/journey/${journey.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span style={{ fontFamily: 'Kalam, cursive' }}>Back to Journey</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <h1
              style={{ fontFamily: 'Permanent Marker, cursive' }}
              className="text-xl text-purple-600 flex items-center gap-2"
            >
              <Sparkles size={24} />
              Edit: {journey.location || journey.title}
            </h1>
          </div>
          
          <div className="text-sm" style={{ fontFamily: 'Kalam, cursive' }}>
            {saveStatus === 'saving' && <span className="text-gray-500">Saving...</span>}
            {saveStatus === 'saved' && <span className="text-green-600">✓ Saved!</span>}
            {saveStatus === 'error' && <span className="text-red-600">Failed to save</span>}
          </div>
        </div>
      </header>

      {/* Canvas Editor */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 120px)', minHeight: '600px' }}>
          <JourneyCanvas
            initialData={journey.canvas_data || createBlankCanvas()}
            onSave={handleSave}
            readOnly={false}
          />
        </div>
      </div>
    </div>
  );
}
