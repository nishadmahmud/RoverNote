import { NextRequest, NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/utils/supabase/admin';

type Tier = 'free' | 'premium';

function createAnonSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: NextRequest) {
  // Dev-only: lets you test Premium gating/UI without relying on Paddle delivering webhooks to localhost.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const tier: Tier = body.tier;
  if (tier !== 'free' && tier !== 'premium') {
    return NextResponse.json({ error: 'tier must be free or premium' }, { status: 400 });
  }

  // For safety, allow only updating the authenticated user.
  const authHeader = req.headers.get('Authorization');
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1] ?? null;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const anon = createAnonSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await anon.auth.getUser(token);

  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const premiumUntil =
    tier === 'premium'
      ? body.premium_until
        ? new Date(body.premium_until).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;

  const admin = createAdminClient();
  const { error } = await admin
    .from('user_tiers')
    .upsert(
      {
        user_id: user.id,
        tier,
        premium_until: premiumUntil,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, tier, premium_until: premiumUntil });
}

