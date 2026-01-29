-- Allow admins to delete document metadata
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'documents'
      AND policyname = 'Admins can delete documents'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can delete documents" ON public.documents';
  END IF;
END $$;

CREATE POLICY "Admins can delete documents"
  ON public.documents FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete storage objects
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can delete documents'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can delete documents" ON storage.objects';
  END IF;
END $$;

CREATE POLICY "Admins can delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'insidan-bucket' AND public.has_role(auth.uid(), 'admin'));
