import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDocuments(categoryId?: string) {
  return useQuery({
    queryKey: ["documents", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select("*, categories(name, slug)")
        .order("created_at", { ascending: false });
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

export function useRecentDocuments(limit: number = 5) {
  return useQuery({
    queryKey: ["recent-documents", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, categories(name, slug)")
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
}
