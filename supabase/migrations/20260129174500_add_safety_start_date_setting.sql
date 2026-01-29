-- Add optional safety counter start date setting
INSERT INTO public.site_settings (key, value)
VALUES ('safety_start_date', '2025-11-18T00:00:00')
ON CONFLICT (key) DO NOTHING;
