import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { verifyPaddleWebhookSignature } from '@/lib/billing/paddle';

function pickPremiumUntil(subscription: any): string | null {
  const nextBilledAt = subscription?.next_billed_at;
  if (typeof nextBilledAt === 'string' && nextBilledAt) return nextBilledAt;

  // Some payloads include current_billing_period (field names can vary slightly).
  const billingPeriod = subscription?.current_billing_period;
  const endsAt =
    billingPeriod?.ends_at ??
    billingPeriod?.end_date ??
    billingPeriod?.endsAt ??
    billingPeriod?.endDate ??
    null;
  if (typeof endsAt === 'string' && endsAt) return endsAt;

  return null;
}

export async function POST(req: NextRequest) {
  const endpointSecretKey = process.env.PADDLE_WEBHOOK_SECRET_KEY;
  if (!endpointSecretKey) {
    return NextResponse.json({ error: 'Missing PADDLE_WEBHOOK_SECRET_KEY' }, { status: 500 });
  }

  const paddleSignatureHeader =
    req.headers.get('Paddle-Signature') ?? req.headers.get('paddle-signature');
  if (!paddleSignatureHeader) {
    return NextResponse.json({ error: 'Missing Paddle-Signature header' }, { status: 400 });
  }

  // Important: verify against the raw body (no JSON parsing before verifying).
  const rawBody = await req.text();
  const isValid = verifyPaddleWebhookSignature({
    paddleSignatureHeader,
    rawBody,
    endpointSecretKey,
  });
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid Paddle signature' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const eventId: string | null = payload?.event_id ?? null;
  const eventType: string | null = payload?.event_type ?? null;
  const subscription = payload?.data ?? null;

  // Idempotency: store processed event IDs.
  const admin = createAdminClient();
  if (eventId) {
    try {
      await admin.from('paddle_webhook_events').insert({ event_id: eventId });
    } catch (e: any) {
      // Duplicate event_id is fine (idempotency). We just return 200.
      // Postgres unique violation is commonly 23505.
      if (e?.code === '23505') {
        return NextResponse.json({ received: true, deduped: true });
      }
      // For other errors, don't fail the webhook; it may be temporary.
    }
  }

  if (!eventType || !subscription) {
    return NextResponse.json({ received: true });
  }

  // We only care about subscription lifecycle changes.
  if (!eventType.startsWith('subscription.')) {
    return NextResponse.json({ received: true });
  }

  // We send `customData: { user_id }` at checkout open, and Paddle copies it to subscriptions.
  const userId: string | null = subscription?.custom_data?.user_id ?? null;
  if (!userId) {
    return NextResponse.json({ received: true });
  }

  const premiumUntil = pickPremiumUntil(subscription);
  const premiumUntilDate = premiumUntil ? new Date(premiumUntil) : null;
  const isPremium = premiumUntilDate ? premiumUntilDate.getTime() > Date.now() : false;

  const tier = isPremium ? 'premium' : 'free';

  const paddleSubscriptionId = subscription?.id ?? null;
  const status = subscription?.status ?? null;

  // Store premium_until as ISO string (nullable).
  const premiumUntilIso = premiumUntilDate ? premiumUntilDate.toISOString() : null;

  // Upsert tier row.
  const { error: upsertError } = await admin
    .from('user_tiers')
    .upsert(
      {
        user_id: userId,
        tier,
        premium_until: premiumUntilIso,
        paddle_subscription_id: paddleSubscriptionId,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  if (upsertError) {
    // Still return 200 so Paddle doesn't keep retrying due to transient failures.
    return NextResponse.json({ received: true, error: upsertError.message });
  }

  return NextResponse.json({ received: true });
}

