-- E-Mall schema + RLS
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(12,2) not null,
  compare_at_price numeric(12,2),
  brand text,
  category_id uuid references public.categories(id),
  rating_avg numeric(3,2) default 0,
  review_count int default 0,
  stock_count int not null default 0,
  in_stock boolean not null default true,
  features jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

create table if not exists public.product_variants (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  name text not null,
  options jsonb not null default '[]'::jsonb,
  sku text,
  price_delta numeric(12,2) default 0,
  stock int default 0
);

create table if not exists public.reviews (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text not null,
  moderated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Home',
  line1 text not null,
  city text not null,
  state text,
  postal text not null,
  country text not null default 'US',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id bigserial primary key,
  code text unique not null,
  type text not null check (type in ('percentage', 'fixed', 'free_shipping')),
  value numeric(12,4) not null default 0,
  active boolean not null default true,
  min_subtotal numeric(12,2) default 0,
  expires_at timestamptz
);

create table if not exists public.orders (
  id text primary key default ('ORD' || floor(extract(epoch from now())*1000)::text),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'confirmed'
    check (status in ('confirmed','processing','shipped','delivered','cancelled')),
  subtotal numeric(12,2) not null,
  tax numeric(12,2) not null,
  shipping numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  currency text not null default 'USD',
  shipping_address jsonb,
  stripe_payment_intent_id text,
  tracking_number text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id),
  variant_snapshot jsonb default '{}'::jsonb,
  quantity int not null,
  unit_price numeric(12,2) not null
);

create table if not exists public.order_status_events (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.newsletter_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    case when new.email = 'admin@emall.com' then 'admin' else 'customer' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Review aggregates
create or replace function public.refresh_product_rating()
returns trigger
language plpgsql
as $$
begin
  update public.products p set
    rating_avg = coalesce((select avg(rating)::numeric(3,2) from public.reviews r where r.product_id = coalesce(new.product_id, old.product_id) and r.moderated), 0),
    review_count = coalesce((select count(*) from public.reviews r where r.product_id = coalesce(new.product_id, old.product_id) and r.moderated), 0)
  where p.id = coalesce(new.product_id, old.product_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.refresh_product_rating();

-- Helper
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.reviews enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;
alter table public.wishlists enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profiles
create policy "Public profiles read" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin update profiles" on public.profiles for update using (public.is_admin());

-- Catalog public read
create policy "Categories public read" on public.categories for select using (true);
create policy "Products public read" on public.products for select using (true);
create policy "Product images public read" on public.product_images for select using (true);
create policy "Product variants public read" on public.product_variants for select using (true);
create policy "Admin manage products" on public.products for all using (public.is_admin());
create policy "Admin manage categories" on public.categories for all using (public.is_admin());
create policy "Admin manage images" on public.product_images for all using (public.is_admin());
create policy "Admin manage variants" on public.product_variants for all using (public.is_admin());

-- Reviews
create policy "Read moderated reviews" on public.reviews for select using (moderated = true or auth.uid() = user_id or public.is_admin());
create policy "Users insert reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Admin moderate reviews" on public.reviews for update using (public.is_admin());

-- Addresses
create policy "Own addresses" on public.addresses for all using (auth.uid() = user_id);

-- Coupons
create policy "Active coupons read" on public.coupons for select using (active = true or public.is_admin());
create policy "Admin coupons" on public.coupons for all using (public.is_admin());

-- Orders
create policy "Own orders read" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Users insert orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admin update orders" on public.orders for update using (public.is_admin());
create policy "Own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "Insert own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Order events read" on public.order_status_events for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "Admin order events" on public.order_status_events for insert with check (public.is_admin() or auth.uid() is not null);

-- Wishlists
create policy "Own wishlist" on public.wishlists for all using (auth.uid() = user_id);

-- Newsletter
create policy "Anyone subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "Admin read subscribers" on public.newsletter_subscribers for select using (public.is_admin());
