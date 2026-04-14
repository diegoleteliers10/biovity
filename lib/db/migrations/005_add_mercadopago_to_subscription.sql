-- Add MercadoPago fields to subscription table (MercadoPago subscription flow)
-- Run with: psql $DATABASE_URL -f lib/db/migrations/005_add_mercadopago_to_subscription.sql

ALTER TABLE subscription
  ADD COLUMN IF NOT EXISTS mercadopago_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS mercadopago_preference_id TEXT,
  ADD COLUMN IF NOT EXISTS mercadopago_merchant_order_id TEXT,
  ADD COLUMN IF NOT EXISTS external_reference TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_payment_at TIMESTAMPTZ;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1712700000005, '005_add_mercadopago_to_subscription'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '005_add_mercadopago_to_subscription');