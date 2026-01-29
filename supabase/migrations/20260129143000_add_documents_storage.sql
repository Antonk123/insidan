-- Create documents storage bucket (public) if missing
insert into storage.buckets (id, name, public)
values ('insidan-bucket', 'insidan-bucket', true)
on conflict (id) do update set public = true;

-- Allow public read access to documents bucket
create policy "Public can read documents bucket"
  on storage.objects for select
  using (bucket_id = 'insidan-bucket');

-- Allow authenticated users to upload to documents bucket
create policy "Authenticated can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'insidan-bucket');

-- Allow authenticated users to insert document metadata
create policy "Authenticated can add documents"
  on public.documents for insert
  to authenticated
  with check (true);
