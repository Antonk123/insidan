-- Allow public (anon) users to read objects for preview via signed URLs
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can read documents'
  ) THEN
    EXECUTE 'DROP POLICY "Public can read documents" ON storage.objects';
  END IF;
END $$;

CREATE POLICY "Public can read documents"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'insidan-bucket');
