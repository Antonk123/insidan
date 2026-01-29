import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const withTimeout = async <T,>(promise: Promise<T>, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Supabase request timed out")), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase
          .from("site_settings")
          .select("*"),
        8000
      );
      
      if (error) throw error;
      
      // Convert array to key-value object
      const settings: Record<string, string> = {};
      data?.forEach((setting) => {
        settings[setting.key] = setting.value;
      });
      
      return settings;
    },
  });
}
