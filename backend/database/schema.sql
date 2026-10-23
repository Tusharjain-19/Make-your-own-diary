-- Storybound Core Database Schema & RLS Policies (backend.md)

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- 2. Books Table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled',
  size text not null default 'A5',               -- 'A5' | 'A4' | 'SQ'
  theme_id text not null,
  cover_front jsonb,
  cover_back jsonb,
  spine jsonb,
  status text not null default 'draft',         -- 'draft' | 'exported' | 'ordered'
  version int not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Pages Table (stored in mm units)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  position int not null,
  data jsonb not null,                           -- background + elements (mm units)
  updated_at timestamptz default now(),
  unique (book_id, position)
);

-- 4. Assets Table
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  kind text not null,                            -- 'photo' | 'upload_icon'
  storage_path text not null,
  thumb_path text,
  preview_path text,
  width int,
  height int,
  bytes int,
  created_at timestamptz default now()
);

-- 5. Handwriting Fonts Table
create table if not exists public.handwriting_fonts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  font_path text not null,                       -- .otf in private bucket
  source_sheet_path text,
  glyph_count int,
  status text default 'ready',                  -- 'processing' | 'ready' | 'failed'
  created_at timestamptz default now()
);

-- 6. Exports Table
create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null,                            -- 'preview' | 'pdf' | 'print'
  book_version int not null,
  status text not null default 'queued',         -- 'queued' | 'running' | 'done' | 'failed'
  file_path text,
  error text,
  created_at timestamptz default now(),
  finished_at timestamptz
);

-- 7. Payments Table (Razorpay)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  book_id uuid references public.books(id),
  purpose text not null,                         -- 'pdf_export' | 'print_order'
  amount_paise int not null,
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text not null default 'created',        -- 'created' | 'paid' | 'failed' | 'refunded'
  created_at timestamptz default now()
);

-- 8. Orders Table (Hardcover Print Orders)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  book_id uuid references public.books(id),
  payment_id uuid references public.payments(id),
  product text not null,                         -- 'mini' | 'travel_diary' | 'classic'
  copies int default 1,
  address jsonb not null,
  status text not null default 'placed',         -- 'placed' | 'printing' | 'shipped' | 'delivered' | 'cancelled'
  tracking_url text,
  print_file_path text,
  created_at timestamptz default now()
);

-- 9. PDF Entitlements Table (PDF Download Permissions)
create table if not exists public.pdf_entitlements (
  book_id uuid references public.books(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  paid_at timestamptz default now(),
  free_reexport_until timestamptz,
  primary key (book_id, user_id)
);

-- 10. Print Products Specification & Quotes Table (Day 22 / Day 23 / backend.md)
create table if not exists public.print_products (
  id text primary key,                           -- 'mini' | 'travel_diary' | 'classic'
  name text not null,
  description text,
  size text not null,                            -- 'A5' | 'A4' | 'Square'
  paper_weight_gsm int not null default 130,     -- e.g. 130gsm Munken Pure / 170gsm Silk
  cover_type text not null default 'hardcover',  -- hardcover with 2mm Dutch board
  bulk_factor float not null default 1.25,       -- paper bulk factor
  paper_caliper_mm float not null default 0.14,  -- thickness per leaf (2 pages) in mm
  hinge_gap_mm float not null default 8.0,       -- hinge wrap gap in mm
  wrap_bleed_mm float not null default 20.0,     -- board wrap bleed for hardcover wrap (20mm)
  interior_bleed_mm float not null default 3.0,  -- 3mm page bleed
  safe_margin_mm float not null default 7.0,     -- safe area margin inside trim
  min_pages int not null default 10,
  max_pages int not null default 80,
  base_price_paise int not null,                 -- price in paise (e.g. ₹699, ₹999, ₹1499)
  extra_page_price_paise int not null default 2000, -- per additional 2 pages
  active boolean default true
);

-- Seed Default Print Products
insert into public.print_products (id, name, description, size, paper_weight_gsm, cover_type, bulk_factor, paper_caliper_mm, hinge_gap_mm, wrap_bleed_mm, interior_bleed_mm, safe_margin_mm, min_pages, max_pages, base_price_paise, extra_page_price_paise, active)
values
  ('mini', 'Mini Keepsake', '148 x 148 mm Square Hardcover, 130gsm Munken Pure natural cream paper, matte finish.', 'Square', 130, 'hardcover', 1.25, 0.12, 7.0, 20.0, 3.0, 6.0, 10, 60, 69900, 1500, true),
  ('travel_diary', 'Travel Diary', 'A5 (148 x 210 mm) Hardcover with Silk Bookmark Ribbon, 170gsm archival art paper.', 'A5', 170, 'hardcover', 1.30, 0.15, 8.0, 20.0, 3.0, 7.0, 10, 80, 99900, 2000, true),
  ('classic', 'Classic Heritage Album', 'A4 (210 x 297 mm) Deluxe Casebound Hardcover, 200gsm textured layflat paper.', 'A4', 200, 'hardcover', 1.35, 0.18, 9.0, 22.0, 3.0, 8.0, 10, 100, 149900, 2500, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  base_price_paise = excluded.base_price_paise;

-- Trigger to auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if re-running
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.pages enable row level security;
alter table public.assets enable row level security;
alter table public.handwriting_fonts enable row level security;
alter table public.exports enable row level security;
alter table public.payments enable row level security;
alter table public.orders enable row level security;
alter table public.pdf_entitlements enable row level security;
alter table public.print_products enable row level security;

-- RLS Policies
create policy "Users can view and update own profile"
  on public.profiles for all
  using (auth.uid() = id);

create policy "Users can CRUD own books"
  on public.books for all
  using (auth.uid() = user_id);

create policy "Users can CRUD pages for own books"
  on public.pages for all
  using (
    exists (
      select 1 from public.books
      where books.id = pages.book_id
      and books.user_id = auth.uid()
    )
  );

create policy "Users can CRUD own assets"
  on public.assets for all
  using (auth.uid() = user_id);

create policy "Users can CRUD own handwriting fonts"
  on public.handwriting_fonts for all
  using (auth.uid() = user_id);

create policy "Users can view own exports"
  on public.exports for select
  using (auth.uid() = user_id);

create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can view and manage all orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Users can view own entitlements"
  on public.pdf_entitlements for select
  using (auth.uid() = user_id);

create policy "Anyone can view active print products"
  on public.print_products for select
  using (active = true);
