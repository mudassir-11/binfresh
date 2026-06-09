-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.service_jobs CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

-- 1. customers: user data
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    -- Stripe
    stripe_customer_id TEXT,
    -- Extra info
    referral_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE public.customers IS 'Stores customer personal and contact information.';

-- 2. plans: pricing and frequency
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    frequency TEXT CHECK (frequency IN ('weekly','monthly','bi-weekly','one-time')) NOT NULL
);
COMMENT ON TABLE public.plans IS 'Stores available service plans, their pricing, and frequencies.';

-- Insert default plans
INSERT INTO public.plans (name, price, frequency) VALUES 
    ('Essential', 19.99, 'monthly'),
    ('Fresh', 34.99, 'bi-weekly'),
    ('One-Time Clean', 44.99, 'one-time');

-- 3. subscriptions: recurring agreements
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id),
    plan_name TEXT,
    status TEXT CHECK (status IN ('active','canceled','paused')) DEFAULT 'active',
    bin_count INTEGER DEFAULT 1,
    scent TEXT,
    next_service_date DATE,
    -- Stripe
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    stripe_price_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE public.subscriptions IS 'Stores recurring service agreements between customers and plans.';

-- 4. bookings: ONLY for one-time services
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id),
    service_date DATE NOT NULL,
    status TEXT CHECK (status IN ('scheduled','completed','canceled')) DEFAULT 'scheduled',
    bin_count INTEGER DEFAULT 1,
    scent TEXT,
    -- Stripe
    stripe_session_id TEXT,
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE public.bookings IS 'Stores one-off, non-recurring service bookings.';

-- 5. service_jobs: CORE TABLE (execution layer - your daily work list)
CREATE TABLE public.service_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    job_date DATE NOT NULL,
    job_type TEXT CHECK (job_type IN ('subscription','one-time')),
    status TEXT CHECK (status IN ('pending','in_progress','completed')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- Prevent duplicate jobs for the same customer on the same day
    UNIQUE(customer_id, job_date)
);
COMMENT ON TABLE public.service_jobs IS 'Single source of truth for daily operations. Tracks actual work to be performed.';

-- INDEXES
CREATE INDEX idx_service_jobs_job_date ON public.service_jobs(job_date);
CREATE INDEX idx_service_jobs_customer_id ON public.service_jobs(customer_id);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_stripe_id ON public.customers(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- SECURITY: Enable Row Level Security (RLS) on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_jobs ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for all ONLY for plans (so frontend can read pricing if needed)
CREATE POLICY "Allow SELECT plans" ON public.plans FOR SELECT USING (true);

-- Require authentication for SELECTing customer data
CREATE POLICY "Allow SELECT customers" ON public.customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow SELECT subscriptions" ON public.subscriptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow SELECT bookings" ON public.bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow SELECT service_jobs" ON public.service_jobs FOR SELECT USING (auth.role() = 'authenticated');

-- We REMOVE public INSERT/UPDATE policies entirely.
-- The API routes (webhook and create-checkout) use the SUPABASE_SERVICE_ROLE_KEY, 
-- which automatically bypasses RLS and can insert/update records securely.
