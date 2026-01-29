-- Create documents storage bucket (public) if missing
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- Allow public read access to documents bucket
create policy "Public can read documents bucket"
  on storage.objects for select
  using (bucket_id = 'documents');

-- Allow authenticated users to upload to documents bucket
create policy "Authenticated can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

-- Allow authenticated users to insert document metadata
create policy "Authenticated can add documents"
  on public.documents for insert
  to authenticated
  with check (true);
