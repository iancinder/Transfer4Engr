import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PACKAGES } from "@/lib/packages";
import { SITE_URL } from "@/lib/site";

/**
 * Creates a Stripe Checkout Session for one service package and returns its
 * hosted-checkout URL. The browser POSTs a package id, we look the price up
 * from PACKAGES on the server, and Stripe hosts the actual payment page — so
 * no card data ever touches this app, and the client can't tamper with the
 * amount.
 */

// The Stripe SDK needs Node APIs; keep this off the Edge runtime.
export const runtime = "nodejs";

export async function POST(request: Request) {
  let packageId: unknown;
  try {
    ({ packageId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const pkg = PACKAGES.find((p) => p.id === packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package." }, { status: 400 });
  }

  // Prefer the real request origin (works on localhost and every deploy URL);
  // fall back to the canonical site origin if the header is absent.
  const origin = request.headers.get("origin") ?? SITE_URL;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: pkg.priceCents,
            product_data: {
              name: pkg.name,
              description: pkg.tagline,
            },
          },
        },
      ],
      // Collect an email so you know who paid and can start the engagement.
      billing_address_collection: "auto",
      // `{CHECKOUT_SESSION_ID}` is a literal token Stripe substitutes on redirect.
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing/cancel`,
      // Surfaces the chosen tier in the Stripe Dashboard for easy fulfillment.
      metadata: { packageId: pkg.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
