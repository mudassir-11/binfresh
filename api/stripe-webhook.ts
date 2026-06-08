import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil' as any,
});

// Supabase is optional
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

      // ── One-time payment completed ─────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata ?? {};

        if (!supabase) {
          console.log('[webhook] Supabase not configured — skipping DB write');
          break;
        }

        try {
          if (session.mode === 'payment') {
            await supabase.from('bookings').insert({
              customer_id: meta.customer_id || null,
              plan_id: null,
              service_date: meta.service_date || new Date().toISOString().split('T')[0],
              status: 'scheduled',
            });
            console.log(`[webhook] Created booking for customer ${meta.customer_id}`);
          }

          if (session.mode === 'subscription') {
            await supabase.from('subscriptions').insert({
              customer_id: meta.customer_id || null,
              plan_id: null,
              status: 'active',
              next_service_date: meta.service_date || null,
            });
            console.log(`[webhook] Created subscription for customer ${meta.customer_id}`);
          }
        } catch (dbErr) {
          console.warn('[webhook] DB write failed (non-fatal):', dbErr);
        }
        break;
      }

      // ── Payment failed ────────────────────────────────────────────────────
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(`[webhook] Payment failed for PaymentIntent ${pi.id}`);
        break;
      }

      // ── Subscription events ───────────────────────────────────────────────
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] Subscription created: ${sub.id}, status: ${sub.status}`);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] Subscription updated: ${sub.id}, status: ${sub.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[webhook] Subscription cancelled: ${sub.id}`);
        // Update subscription status in Supabase
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('status', 'active')
          // Note: once we store stripe_subscription_id we can match precisely
          .not('customer_id', 'is', null);
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
