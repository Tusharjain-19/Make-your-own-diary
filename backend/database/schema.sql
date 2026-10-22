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

create policy "Users can view own entitlements"
  on public.pdf_entitlements for select
  using (auth.uid() = user_id);
