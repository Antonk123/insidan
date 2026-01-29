-- Ensure admins can insert document metadata
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'documents'
      AND policyname = 'Authenticated can add documents'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can add documents" ON public.documents';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'documents'
      AND policyname = 'Admins can add documents'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can add documents" ON public.documents';
  END IF;
END $$;

CREATE POLICY "Admins can add documents"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Ensure admins can upload to storage bucket
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated can upload documents'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can upload documents" ON storage.objects';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can upload documents'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can upload documents" ON storage.objects';
  END IF;
END $$;

CREATE POLICY "Admins can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'insidan-bucket' AND public.has_role(auth.uid(), 'admin'));

-- Optional: allow authenticated users to read from the bucket
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated can read documents'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can read documents" ON storage.objects';
  END IF;
END $$;

CREATE POLICY "Authenticated can read documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'insidan-bucket');
