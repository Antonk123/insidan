-- Add category for Affärsidé och Policy
INSERT INTO public.categories (name, description, slug, sort_order, parent_id)
VALUES (
  'Affärsidé och Policy',
  'Grundläggande riktning för verksamheten.',
  'affarside-och-policy',
  10,
  NULL
)
ON CONFLICT (slug) DO NOTHING;
