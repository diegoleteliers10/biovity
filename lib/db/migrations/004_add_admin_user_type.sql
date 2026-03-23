-- Add admin to user_type_enum for admin users (BIO-27 / admin redirect)
-- Run with: psql $DATABASE_URL -f lib/db/migrations/004_add_admin_user_type.sql
--
-- Users with type='admin' or email in ADMIN_EMAILS get admin dashboard at /dashboard.

ALTER TYPE user_type_enum ADD VALUE IF NOT EXISTS 'admin';

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000003, '004_add_admin_user_type'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '004_add_admin_user_type');
