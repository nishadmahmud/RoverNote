import { NextRequest, NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getBearerToken(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function createAnonSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function requireUser(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) return { user: null as any, supabase: null as any, status: 401 as const };

  const supabase = createAnonSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return { user: null as any, supabase: null as any, status: 401 as const };
  }

  return { user, supabase, status: 200 as const };
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, supabase, status } = await requireUser(req);
  if (status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status });

  // RPC should handle like increment rules.
  const { error } = await supabase.rpc('increment_likes', { journey_id: params.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

