-- Categories table for organizing documents
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Documents table for storing document metadata
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL DEFAULT 'pdf', -- pdf, excel, word, link
  url TEXT NOT NULL,
  is_external BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quick links for homepage
CREATE TABLE public.quick_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Site settings (safety counter, etc)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for public content
CREATE POLICY "Public can read public categories"
  ON public.categories FOR SELECT
  USING (is_public = true);

CREATE POLICY "Public can read public documents"
  ON public.documents FOR SELECT
  USING (is_public = true);

CREATE POLICY "Public can read public quick links"
  ON public.quick_links FOR SELECT
  USING (is_public = true);

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Insert initial safety counter setting
INSERT INTO public.site_settings (key, value) VALUES ('days_without_accidents', '0');

-- Insert sample categories based on user's current structure
INSERT INTO public.categories (name, description, slug, sort_order, parent_id) VALUES
  ('Huvudprocesser', 'Våra huvudsakliga affärsprocesser', 'huvudprocesser', 1, NULL),
  ('Stödprocesser', 'Stödjande processer och rutiner', 'stodprocesser', 2, NULL);

-- Insert sample quick links
INSERT INTO public.quick_links (title, url, icon, sort_order) VALUES
  ('VLS', '#', 'building', 1),
  ('Projekttavla', '#', 'layout-dashboard', 2),
  ('Telefonlista', '#', 'phone', 3),
  ('IT-support', '#', 'headphones', 4);