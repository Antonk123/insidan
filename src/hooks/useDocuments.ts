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
      
      const { data, error } = await withTimeout(query, 8000);
      
      if (error) throw error;
      return data;
    },
  });
}

export function useRecentDocuments(limit: number = 5) {
  return useQuery({
    queryKey: ["recent-documents", limit],
    queryFn: async () => {
      const { data, error } = await withTimeout(
        supabase
          .from("documents")
          .select("*, categories(name, slug)")
          .order("created_at", { ascending: false })
          .limit(limit),
        8000
      );
      
      if (error) throw error;
      return data;
    },
  });
}
