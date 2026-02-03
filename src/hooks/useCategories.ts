import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Helper function to generate a unique slug
function generateSlug(name: string, parentSlug?: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  
  return parentSlug ? `${parentSlug}-${baseSlug}` : baseSlug;
}

interface CreateCategoryParams {
  name: string;
  description?: string;
  parentId: string;
  parentSlug: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, description, parentId, parentSlug }: CreateCategoryParams) => {
      const slug = generateSlug(name, parentSlug);
      
      // Get max sort_order for siblings
      const { data: siblings } = await supabase
        .from("categories")
        .select("sort_order")
        .eq("parent_id", parentId)
        .order("sort_order", { ascending: false })
        .limit(1);
      
      const nextSortOrder = (siblings?.[0]?.sort_order ?? 0) + 1;
      
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name,
          description: description || null,
          parent_id: parentId,
          slug,
          sort_order: nextSortOrder,
          is_public: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

interface UpdateCategoryParams {
  id: string;
  name: string;
  description?: string;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, name, description }: UpdateCategoryParams) => {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name,
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryId: string) => {
      // Check if category has documents
      const { data: docs, error: docsError } = await supabase
        .from("documents")
        .select("id")
        .eq("category_id", categoryId)
        .limit(1);
      
      if (docsError) throw docsError;
      
      if (docs && docs.length > 0) {
        throw new Error("Kan inte ta bort mappen - den innehåller dokument. Flytta eller ta bort dokumenten först.");
      }
      
      // Check if category has subcategories
      const { data: subcats, error: subcatsError } = await supabase
        .from("categories")
        .select("id")
        .eq("parent_id", categoryId)
        .limit(1);
      
      if (subcatsError) throw subcatsError;
      
      if (subcats && subcats.length > 0) {
        throw new Error("Kan inte ta bort mappen - den innehåller undermappar.");
      }
      
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
