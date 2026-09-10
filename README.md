# E-Mall

Vue 3 + Vite e-commerce storefront with Supabase Auth/Postgres/RLS and Stripe Payment Element. Runs in **mock mode** by default so you can develop without cloud credentials.

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173

### Demo accounts (mock mode)

| Role | Email | Password |
|------|-------|----------|
| Customer | `user@emall.com` | `password123` |
| Admin | `admin@emall.com` | any password |

Coupons: `SAVE10`, `SAVE20`, `FREESHIP`

## Environment

Copy `.env.example` to `.env.local`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_USE_MOCK_DATA=false
```

Set `VITE_USE_MOCK_DATA=true` to use local catalog/auth/orders without Supabase.

**Never** put the Supabase service role key or Stripe secret key in the SPA. Those belong in Edge Function secrets only.

## Supabase setup

1. Create a Supabase project.
2. Apply migrations in order:
   - `supabase/migrations/20240910000000_init.sql`
   - `supabase/migrations/20240910000001_seed.sql`
3. Create an admin user (`admin@emall.com`) via Auth; the trigger sets `profiles.role = admin` for that email.
4. Seed products via SQL or Admin → Products.
5. Enable Google/Facebook OAuth in Authentication → Providers (optional).
6. Deploy Edge Functions:

```bash
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
```

Set secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.

Point Stripe webhooks to the `stripe-webhook` function URL for `payment_intent.succeeded`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview build |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm test` | Vitest unit tests |

## Architecture

- **Stores (Pinia):** auth, products, cart (coupon-aware totals), wishlist, ui (toasts/locale/currency)
- **Services:** Supabase-backed with mock fallbacks under `src/services/`
- **Admin:** `/admin/*` with sidebar layout (products, orders, customers, coupons, reviews, reports)
- **Checkout:** Stripe Payment Element when configured; otherwise simulated payment + local orders

## Package manager

This project uses **pnpm** only (`pnpm-lock.yaml`).
