-- Allow admins to update document metadata
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'documents'
      AND policyname = 'Authenticated can update documents'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can update documents" ON public.documents';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'documents'
      AND policyname = 'Admins can update documents'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can update documents" ON public.documents';
  END IF;
END $$;

CREATE POLICY "Admins can update documents"
  ON public.documents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update storage objects (for overwrite)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated can update documents'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated can update documents" ON storage.objects';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can update documents'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can update documents" ON storage.objects';
  END IF;
END $$;

CREATE POLICY "Admins can update documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'insidan-bucket' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'insidan-bucket' AND public.has_role(auth.uid(), 'admin'));
