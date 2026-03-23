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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, supabase, status } = await requireUser(req);
  if (status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status });

  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ journey: data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user, supabase, status } = await requireUser(req);
  if (status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  const payload: any = body;

  const updatePayload: any = {
    title: payload.title,
    location: payload.location ?? null,
    country: payload.country ?? null,
    start_date: payload.start_date ?? null,
    end_date: payload.end_date ?? null,
    body: payload.body ?? null,
    tags: payload.tags ?? null,
    is_public: payload.is_public ?? true,
    image_url: payload.image_url ?? null,
    image_path: payload.image_path ?? null,
    additional_images: payload.additional_images ?? null,
    canvas_data: payload.canvas_data ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('journeys')
    .update(updatePayload)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ journey: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, supabase, status } = await requireUser(req);
  if (status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status });

  const { error } = await supabase
    .from('journeys')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

