/**
 * Server-only Stripe client.
 *
 * Never import this from a Client Component — it reads the secret key. Only
 * route handlers and Server Components may touch it. The key lives in
 * `.env.local` (and in the deploy host's env), never in the repo.
 *
 * The client is created lazily on first use rather than at module load, so a
 * missing key fails a real checkout request with a clear message instead of
 * breaking `next build` (which imports route modules before env is present).
 */
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example)."
    );
  }

  // We omit `apiVersion` so the SDK uses the version it was published against
  // (stripe@22 → 2026-06-24.dahlia), keeping the TS types and wire calls aligned.
  client = new Stripe(secretKey);
  return client;
}
