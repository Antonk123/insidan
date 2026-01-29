-- Seed documents for Affärsidé och Policy category
WITH category AS (
  SELECT id
  FROM public.categories
  WHERE slug = 'affarside-och-policy'
  LIMIT 1
)
INSERT INTO public.documents (title, description, category_id, document_type, url, is_external, is_public, is_new, tags)
SELECT * FROM (
  VALUES
    ('Systemets Uppbyggnad', NULL, (SELECT id FROM category), 'pdf', 'http://insidan.pitea.local/VLS/PUBLICERADE/1.1.pdf', true, true, true, ARRAY['affarside']),
    ('Policy', NULL, (SELECT id FROM category), 'pdf', 'http://insidan.pitea.local/VLS/PUBLICERADE/2.1.pdf', true, true, true, ARRAY['policy']),
    ('Uppförandekod', NULL, (SELECT id FROM category), 'pdf', 'http://insidan.pitea.local/VLS/PUBLICERADE/2.3.pdf', true, true, true, ARRAY['policy','uppforandekod']),
    ('Sammanfattande beskrivning för ledningssystem', NULL, (SELECT id FROM category), 'pdf', 'http://insidan.pitea.local/VLS/PUBLICERADE/1.4.pdf', true, true, true, ARRAY['ledning','sammanfattning']),
    ('Vårt uppdrag', NULL, (SELECT id FROM category), 'pdf', 'http://insidan.pitea.local/VLS/PUBLICERADE/2.2.pdf', true, true, true, ARRAY['uppdrag'])
) AS data(title, description, category_id, document_type, url, is_external, is_public, is_new, tags)
WHERE (SELECT id FROM category) IS NOT NULL
ON CONFLICT DO NOTHING;
