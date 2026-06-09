import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil' as any,
});

// Use service role key so webhook can bypass RLS and update any record
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Disable automatic body parsing so we can verify the Stripe signature
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[webhook] Missing signature or webhook secret');
    return res.status(400).json({ error: 'Missing stripe-signature or STRIPE_WEBHOOK_SECRET' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  console.log(`[webhook] Event received: ${event.type}`);

  try {
    switch (event.type) {

      // ── Checkout completed (one-time OR subscription) ──────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata ?? {};

        if (!supabase) {
          console.log('[webhook] Supabase not configured — skipping DB write');
          break;
        }

        try {
          const customerId = meta.customer_id || null;
          const serviceDate = meta.service_date || new Date().toISOString().split('T')[0];
          const binCount = parseInt(meta.bin_count ?? '1', 10);

          if (session.mode === 'payment') {
            // ── One-time booking ─────────────────────────────────────────────
            await supabase.from('bookings').insert({
              customer_id: customerId,
              plan_id: null,
              service_date: serviceDate,
              status: 'scheduled',
              bin_count: binCount,
              scent: meta.scent ?? null,
              stripe_session_id: session.id,
              payment_status: 'paid',
            });
            console.log(`[webhook] ✅ Booking created — customer: ${customerId}, date: ${serviceDate}`);
          }

          if (session.mode === 'subscription') {
            // ── Subscription ─────────────────────────────────────────────────
            await supabase.from('subscriptions').insert({
              customer_id: customerId,
              plan_id: null,
              plan_name: meta.plan_name ?? null,
              status: 'active',
              bin_count: binCount,
              scent: meta.scent ?? null,
              next_service_date: serviceDate,
              stripe_subscription_id: session.subscription as string ?? null,
              stripe_customer_id: session.customer as string ?? null,
            });
            console.log(`[webhook] ✅ Subscription created — customer: ${customerId}, plan: ${meta.plan_name}`);
          }

          // Also update referral_source on the customer record if present
          if (customerId && meta.referral_source) {
            await supabase
              .from('customers')
              .update({ referral_source: meta.referral_source })
              .eq('id', customerId);
          }

        } catch (dbErr) {
          console.warn('[webhook] DB write failed (non-fatal):', dbErr);
        }
        break;
      }

      // ── Payment failed ────────────────────────────────────────────────────
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(`[webhook] ❌ Payment failed — PaymentIntent: ${pi.id}`);
        if (supabase) {
          await supabase
            .from('bookings')
            .update({ payment_status: 'failed', status: 'canceled' })
            .eq('stripe_session_id', pi.id)
            .catch((e: any) => console.warn('[webhook] Failed to update booking status:', e));
        }
        break;
      }

      // ── Subscription created ──────────────────────────────────────────────
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] Subscription created: ${sub.id}, status: ${sub.status}`);
        break;
      }

      // ── Subscription updated ──────────────────────────────────────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] Subscription updated: ${sub.id}, status: ${sub.status}`);
        if (supabase && sub.status === 'past_due') {
          await supabase
            .from('subscriptions')
            .update({ status: 'paused' })
            .eq('stripe_subscription_id', sub.id)
            .catch((e: any) => console.warn('[webhook] Failed to update subscription:', e));
        }
        break;
      }

      // ── Subscription cancelled ────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] ❌ Subscription cancelled: ${sub.id}`);
        if (supabase) {
          await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', sub.id)
            .catch((e: any) => console.warn('[webhook] Failed to cancel subscription:', e));
        }
        break;
      }

      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('[webhook] Handler error:', err);
    return res.status(500).json({ error: err?.message ?? 'Webhook handler error' });
  }
}
