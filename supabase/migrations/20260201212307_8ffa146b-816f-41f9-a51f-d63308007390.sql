-- Create storage policies for admin document management

-- Allow admins to upload files to the insidan-bucket
CREATE POLICY "Admins can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'insidan-bucket' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete files from the insidan-bucket
CREATE POLICY "Admins can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'insidan-bucket' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated users to read files from the insidan-bucket
CREATE POLICY "Authenticated users can read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'insidan-bucket');