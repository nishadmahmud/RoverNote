'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type UserTier = 'free' | 'premium';

export function useUserTier(userId: string | undefined) {
  const [tier, setTier] = useState<UserTier>('free');
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setTier('free');
      setPremiumUntil(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from('user_tiers')
      .select('tier,premium_until')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      setTier('free');
      setPremiumUntil(null);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      // Missing row => treat as free.
      setTier('free');
      setPremiumUntil(null);
      setLoading(false);
      return;
    }

    setTier(data.tier === 'premium' ? 'premium' : 'free');
    setPremiumUntil(data.premium_until ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tier, premiumUntil, loading, error, refresh };
}

