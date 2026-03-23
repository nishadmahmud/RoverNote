import { createHmac, timingSafeEqual } from 'crypto';

export type PaddleSignatureParts = {
  ts: string;
  h1: string;
};

function parsePaddleSignatureHeader(paddleSignature: string): PaddleSignatureParts | null {
  // Format: ts=1671552777;h1=eb4d...
  const parts = paddleSignature.split(';').map((s) => s.trim());

  const tsPart = parts.find((p) => p.startsWith('ts='));
  const h1Part = parts.find((p) => p.startsWith('h1='));

  if (!tsPart || !h1Part) return null;

  const ts = tsPart.split('=')[1];
  const h1 = h1Part.split('=')[1];

  if (!ts || !h1) return null;
  return { ts, h1 };
}

export function verifyPaddleWebhookSignature(args: {
  paddleSignatureHeader: string;
  rawBody: string;
  endpointSecretKey: string;
}): boolean {
  const parsed = parsePaddleSignatureHeader(args.paddleSignatureHeader);
  if (!parsed) return false;

  // Do not transform the raw body (whitespace changes will break verification).
  const signedPayload = `${parsed.ts}:${args.rawBody}`;
  const expectedHmacHex = createHmac('sha256', args.endpointSecretKey)
    .update(signedPayload)
    .digest('hex');

  // Use constant-time compare.
  const expectedBuf = Buffer.from(expectedHmacHex, 'hex');
  const providedBuf = Buffer.from(parsed.h1, 'hex');

  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

