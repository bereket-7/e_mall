-- Seed categories, coupons, and sample catalog (run after auth admin user exists)
insert into public.categories (slug, name) values
  ('electronics', 'Electronics'),
  ('fashion', 'Fashion'),
  ('home', 'Home & Garden'),
  ('books', 'Books'),
  ('sports', 'Sports & Outdoors')
on conflict (slug) do nothing;

insert into public.coupons (code, type, value, active) values
  ('SAVE10', 'percentage', 0.10, true),
  ('SAVE20', 'percentage', 0.20, true),
  ('FREESHIP', 'free_shipping', 0, true)
on conflict (code) do nothing;

-- Note: product rows should be inserted via dashboard or a follow-up seed script
-- after categories exist. Example for one product:
-- insert into products (name, slug, description, price, compare_at_price, brand, category_id, stock_count, in_stock, features)
-- select 'iPhone 15 Pro', 'iphone-15-pro', 'Advanced iPhone', 999, 1099, 'Apple', id, 50, true, '["A17 Pro"]'::jsonb
-- from categories where slug = 'electronics';
