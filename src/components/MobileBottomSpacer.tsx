'use client';

import { useAuth } from '@/hooks/useAuth';

export function MobileBottomSpacer() {
  const { user } = useAuth();

  // Only render spacer on mobile when user is logged in (bottom nav is visible)
  if (!user) return null;

  return (
    <div className="md:hidden h-16" aria-hidden="true" />
  );
}
