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

export function useQuickLinks() {
  return useQuery({
    queryKey: ["quick-links"],
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase
          .from("quick_links")
          .select("*")
          .order("sort_order", { ascending: true }),
        8000
      );
      
      if (error) throw error;
      return data;
    },
  });
}
