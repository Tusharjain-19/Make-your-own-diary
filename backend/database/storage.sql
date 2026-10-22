-- Storybound Supabase Storage Buckets & Policies (backend.md)

-- Create private and public storage buckets
insert into storage.buckets (id, name, public)
values 
  ('photos', 'photos', false),
  ('handwriting', 'handwriting', false),
  ('exports', 'exports', false),
  ('themes-assets', 'themes-assets', true)
on conflict (id) do update set public = excluded.public;

-- 1. Photos Bucket RLS (Private to user folder)
create policy "Users can upload their own photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own photos"
  on storage.objects for select
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- 2. Handwriting Bucket RLS (Private to user)
create policy "Users can upload their own handwriting fonts"
  on storage.objects for insert
  with check (bucket_id = 'handwriting' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read their own handwriting fonts"
  on storage.objects for select
  using (bucket_id = 'handwriting' and auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Exports Bucket RLS (Private to user)
create policy "Users can read their own exports"
  on storage.objects for select
  using (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Themes Assets Bucket RLS (Public read)
create policy "Public can view themes assets"
  on storage.objects for select
  using (bucket_id = 'themes-assets');
