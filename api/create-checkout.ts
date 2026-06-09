import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil' as any,
});

// Supabase is optional — only initialise if both env vars are present
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const APP_URL = process.env.APP_URL ?? 'https://binfresh-mu.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      planName,
      serviceType,
      binCount,
      totalPrice,
      name,
      email,
      phone,
      address,
      city,
      zipCode,
      date,
      scent,
      referralSource,
    } = req.body as {
      planName: string;
      serviceType: string;
      binCount: number;
      totalPrice: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zipCode: string;
      date: string;
      scent: string;
      referralSource: string;
    };

    const isSubscription = serviceType !== 'one-time';

    // ── Optionally save customer to Supabase (non-blocking) ─────────────────
    let customerId: string | null = null;
    if (supabase) {
      try {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || firstName;

        const { data: customer } = await supabase
          .from('customers')
          .upsert(
            { first_name: firstName, last_name: lastName, email, phone, address, city, zip_code: zipCode },
            { onConflict: 'email' }
          )
          .select('id')
          .single();

        customerId = customer?.id ?? null;
      } catch (dbErr) {
        // DB failure is non-fatal — Stripe checkout continues regardless
        console.warn('[create-checkout] Supabase save skipped:', dbErr);
      }
    } else {
      console.log('[create-checkout] Supabase not configured — skipping DB save');
    }

    // ── Build Stripe Checkout Session ───────────────────────────────────────
    // Using price_data for dynamic amounts (handles extra bins automatically)
    const planDisplayName =
      planName === 'Essential'
        ? 'Essential – Every 4 Weeks'
        : planName === 'Fresh'
        ? 'Fresh – Every 2 Weeks'
        : 'One-Time Clean';

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(parseFloat(totalPrice) * 100), // cents
        product_data: {
          name: planDisplayName,
          description: `${binCount} bin${binCount > 1 ? 's' : ''} · ${scent} scent · Service area: ${city}`,
        },
        ...(isSubscription && { recurring: { interval: 'month' } }),
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [lineItem],
      customer_email: email,
      metadata: {
        customer_id: customerId ?? '',
        plan_name: planName,
        service_type: serviceType,
        bin_count: String(binCount),
        scent,
        referral_source: referralSource ?? '',
        service_date: date ?? '',
        total_price: totalPrice,
        city,
        zip_code: zipCode,
      },
      success_url: `${APP_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('[create-checkout] Error:', err);
    return res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
}
