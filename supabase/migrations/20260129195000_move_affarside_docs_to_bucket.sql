-- Update Affärsidé och Policy documents to use storage bucket paths
UPDATE public.documents
SET
  storage_path = CASE title
    WHEN 'Systemets Uppbyggnad' THEN 'affarside-och-policy/1.1.pdf'
    WHEN 'Policy' THEN 'affarside-och-policy/2.1.pdf'
    WHEN 'Uppförandekod' THEN 'affarside-och-policy/2.3.pdf'
    WHEN 'Sammanfattande beskrivning för ledningssystem' THEN 'affarside-och-policy/1.4.pdf'
    WHEN 'Vårt uppdrag' THEN 'affarside-och-policy/2.2.pdf'
    ELSE storage_path
  END,
  url = CASE title
    WHEN 'Systemets Uppbyggnad' THEN 'affarside-och-policy/1.1.pdf'
    WHEN 'Policy' THEN 'affarside-och-policy/2.1.pdf'
    WHEN 'Uppförandekod' THEN 'affarside-och-policy/2.3.pdf'
    WHEN 'Sammanfattande beskrivning för ledningssystem' THEN 'affarside-och-policy/1.4.pdf'
    WHEN 'Vårt uppdrag' THEN 'affarside-och-policy/2.2.pdf'
    ELSE url
  END,
  is_external = false
WHERE category_id IN (
  SELECT id FROM public.categories WHERE slug = 'affarside-och-policy'
)
AND title IN (
  'Systemets Uppbyggnad',
  'Policy',
  'Uppförandekod',
  'Sammanfattande beskrivning för ledningssystem',
  'Vårt uppdrag'
);
