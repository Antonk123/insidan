-- Add optional safety counter start date setting
INSERT INTO public.site_settings (key, value)
VALUES ('safety_start_date', '')
ON CONFLICT (key) DO NOTHING;
