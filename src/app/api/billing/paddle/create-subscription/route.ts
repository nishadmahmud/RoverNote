import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type BillingPeriod = 'monthly' | 'yearly';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // ignore, use defaults
  }

  const period = (body as any)?.period as BillingPeriod | undefined;
  const normalizedPeriod: BillingPeriod = period === 'yearly' ? 'yearly' : 'monthly';

  const clientSideToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_SIDE_TOKEN;
  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PREMIUM_MONTHLY_PRICE_ID;
  const yearlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PREMIUM_YEARLY_PRICE_ID;
  if (!clientSideToken) {
    return NextResponse.json({ error: 'Missing Paddle client-side token' }, { status: 500 });
  }
  if (normalizedPeriod === 'monthly' && !monthlyPriceId) {
    return NextResponse.json({ error: 'Missing Paddle monthly price id' }, { status: 500 });
  }
  if (normalizedPeriod === 'yearly' && !yearlyPriceId) {
    return NextResponse.json({ error: 'Missing Paddle yearly price id' }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rovernote.live';
  const priceId = normalizedPeriod === 'monthly' ? monthlyPriceId! : yearlyPriceId!;

  // We return config for Paddle.js Checkout.open().
  // Paddle will create the subscription after the customer completes checkout.
  return NextResponse.json({
    paddle: {
      clientSideToken,
      items: [{ priceId, quantity: 1 }],
      customData: { user_id: user.id },
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        locale: 'en',
        allowLogout: false,
        successUrl: `${siteUrl}/my-scrapbook?premium=1`,
        cancelUrl: `${siteUrl}/my-scrapbook?premium=0`,
      },
    },
  });
}

