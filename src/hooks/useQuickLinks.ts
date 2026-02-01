import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useQuickLinks() {
  return useQuery({
    queryKey: ["quick-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quick_links")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}
