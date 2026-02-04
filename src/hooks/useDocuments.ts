import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_BUCKET = "insidan-bucket";

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
      if (!data || data.length === 0) return data;

      const withSignedUrls = await Promise.all(
        data.map(async (doc) => {
          if (!doc.storage_path) return doc;
          const { data: signedData, error: signedError } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(doc.storage_path, 60 * 60);
          if (signedError || !signedData?.signedUrl) return doc;
          return { ...doc, url: signedData.signedUrl };
        })
      );

      return withSignedUrls;
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
      if (!data || data.length === 0) return data;

      const withSignedUrls = await Promise.all(
        data.map(async (doc) => {
          if (!doc.storage_path) return doc;
          const { data: signedData, error: signedError } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(doc.storage_path, 60 * 60);
          if (signedError || !signedData?.signedUrl) return doc;
          return { ...doc, url: signedData.signedUrl };
        })
      );

      return withSignedUrls;
    },
  });
}

interface UploadDocumentParams {
  file: File;
  title: string;
  description?: string;
  categoryId?: string;
  isPublic?: boolean;
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, title, description, categoryId, isPublic = true }: UploadDocumentParams) => {
      // Determine document type from file extension
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let documentType = 'pdf';
      if (['xls', 'xlsx'].includes(ext)) documentType = 'excel';
      else if (['doc', 'docx'].includes(ext)) documentType = 'word';
      else if (ext === 'pdf') documentType = 'pdf';

      // Generate a unique file path
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `documents/${timestamp}_${safeName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Get a signed URL for the document
      const { data: signedData } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(storagePath, 60 * 60 * 24 * 365); // 1 year

      const url = signedData?.signedUrl || storagePath;

      // Insert document record
      const { data, error } = await supabase.from("documents").insert({
        title,
        description: description || null,
        category_id: categoryId || null,
        document_type: documentType,
        storage_path: storagePath,
        url,
        is_external: false,
        is_public: isPublic,
        is_new: true,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["recent-documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      // First get the document to find its storage path
      const { data: doc, error: fetchError } = await supabase
        .from("documents")
        .select("storage_path")
        .eq("id", documentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage if there's a storage path
      if (doc?.storage_path) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([doc.storage_path]);

        if (storageError) {
          console.warn("Could not delete file from storage:", storageError);
        }
      }

      // Delete the document record
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["recent-documents"] });
    },
  });
}

interface MoveDocumentParams {
  documentId: string;
  categoryId: string;
}

export function useMoveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, categoryId }: MoveDocumentParams) => {
      const { data, error } = await supabase
        .from("documents")
        .update({
          category_id: categoryId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["recent-documents"] });
    },
  });
}
