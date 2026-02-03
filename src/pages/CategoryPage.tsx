import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Home, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { useCategoryBySlug, useCategories } from "@/hooks/useCategories";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentCard } from "@/components/DocumentCard";
import { DocumentCompactView } from "@/components/DocumentCompactView";
import { SubcategoryManager } from "@/components/SubcategoryManager";
import { ViewModeToggle, ViewMode } from "@/components/ViewModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "doc-view-mode";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug ?? "");
  const { data: allCategories } = useCategories();
  const { data: documents, isLoading: documentsLoading } = useDocuments(category?.id);
  const { user, isAdmin } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === "compact" || saved === "cards") ? saved : "cards";
  });
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, viewMode);
  }, [viewMode]);
  
  // Upload state
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Document editing state
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
  // Get subcategories
  const subcategories = allCategories?.filter((cat) => cat.parent_id === category?.id) ?? [];
  
  // Get parent category for breadcrumb
  const parentCategory = category?.parent_id 
    ? allCategories?.find((cat) => cat.id === category.parent_id)
    : null;

  const bucketName = "insidan-bucket";

  const getDocumentType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "pdf") return "pdf";
    if (ext === "xls" || ext === "xlsx") return "excel";
    if (ext === "doc" || ext === "docx") return "word";
    return "file";
  };

  const handleDelete = async (docId: string, storagePath?: string | null) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Är du säker på att du vill radera dokumentet? Detta går inte att ångra."
    );
    if (!confirmed) return;

    setIsDeletingId(docId);
    try {
      if (storagePath) {
        const { error: storageError } = await supabase
          .storage
          .from(bucketName)
          .remove([storagePath]);
        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (deleteError) throw deleteError;

      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["recent-documents"] });

      toast({
        title: "Dokument borttaget",
        description: "Dokumentet har raderats.",
      });
    } catch (error: any) {
      toast({
        title: "Fel vid borttagning",
        description: error?.message ?? "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleStartEdit = (docId: string, currentTitle: string) => {
    setEditingId(docId);
    setEditingTitle(currentTitle);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveTitle = async (docId: string) => {
    if (!isAdmin) return;
    const nextTitle = editingTitle.trim();
    if (!nextTitle) {
      toast({
        title: "Ogiltigt namn",
        description: "Visningsnamnet kan inte vara tomt.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("documents")
        .update({ title: nextTitle, updated_at: new Date().toISOString() })
        .eq("id", docId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["recent-documents"] });

      toast({
        title: "Uppdaterat",
        description: "Visningsnamnet är uppdaterat.",
      });
      handleCancelEdit();
    } catch (error: any) {
      toast({
        title: "Fel vid uppdatering",
        description: error?.message ?? "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    }
  };

  const addFiles = (incoming: File[]) => {
    const byName = new Map<string, File>();
    files.forEach((f) => byName.set(f.name, f));
    incoming.forEach((f) => byName.set(f.name, f));
    setFiles(Array.from(byName.values()));
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleUpload = async () => {
    if (!user || files.length === 0 || !category?.id) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const cleanName = file.name.replace(/\s+/g, "-");
        const path = `${category.slug}/${cleanName}`;
        const { error: uploadError } = await supabase
          .storage
          .from(bucketName)
          .upload(path, file, { upsert: true });

        if (uploadError) throw uploadError;

        const documentType = getDocumentType(file.name);
        const { data: existingDoc, error: existingError } = await supabase
          .from("documents")
          .select("id")
          .eq("storage_path", path)
          .maybeSingle();

        if (existingError) throw existingError;

        if (existingDoc?.id) {
          const { error: updateError } = await supabase
            .from("documents")
            .update({
              url: path,
              is_new: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingDoc.id);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("documents")
            .insert({
              title: file.name,
              description: null,
              category_id: category.id,
              document_type: documentType,
              url: path,
              storage_path: path,
              is_external: false,
              is_public: true,
              is_new: true,
            });

          if (insertError) throw insertError;
        }
      }

      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["recent-documents"] });

      toast({
        title: "Uppladdning klar",
        description: "Dokumentet har lagts till.",
      });
    } catch (error: any) {
      toast({
        title: "Fel vid uppladdning",
        description: error?.message ?? "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </main>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <h2 className="text-2xl font-bold mb-4">Kategorin hittades inte</h2>
          <Link to="/" className="text-primary hover:underline">
            Tillbaka till startsidan
          </Link>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumb with full path */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Hem
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/vls">VLS</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {parentCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/kategori/${parentCategory.slug}`}>
                      {parentCategory.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
        
        {/* Subcategories with admin management */}
        <SubcategoryManager
          subcategories={subcategories}
          parentCategoryId={category.id}
          parentSlug={category.slug}
          isAdmin={isAdmin}
        />
        
        {/* Documents section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Dokument
            </h2>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </div>

          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ladda upp dokument</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                    const dropped = Array.from(e.dataTransfer.files);
                    if (dropped.length > 0) {
                      addFiles(dropped);
                    }
                  }}
                >
                  <p className="text-sm font-medium">Dra & släpp filer här</p>
                  <p className="text-xs text-muted-foreground">
                    eller klicka för att välja filer
                  </p>
                  <input
                    className="mt-4 text-xs"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const selected = Array.from(e.target.files ?? []);
                      if (selected.length > 0) {
                        addFiles(selected);
                      }
                      e.currentTarget.value = "";
                    }}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Samma filnamn ersätter befintligt dokument.
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Valda filer ({files.length})
                    </p>
                    <div className="space-y-1">
                      {files.map((f) => (
                        <div key={f.name} className="flex items-center justify-between rounded border px-2 py-1 text-xs">
                          <span className="truncate">{f.name}</span>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => removeFile(f.name)}
                          >
                            Ta bort
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
                  {isUploading ? "Laddar upp..." : `Ladda upp ${files.length} fil${files.length === 1 ? "" : "er"}`}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {documentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : documents && documents.length > 0 ? (
            viewMode === "compact" ? (
              <DocumentCompactView
                documents={documents}
                isAdmin={isAdmin}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
                isDeletingId={isDeletingId}
              />
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    <DocumentCard document={doc} />
                    {isAdmin && (
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {editingId === doc.id ? (
                          <>
                            <Input
                              className="h-8 w-64"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                            />
                            <Button size="sm" onClick={() => handleSaveTitle(doc.id)}>
                              Spara
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Avbryt
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEdit(doc.id, doc.title)}
                            >
                              Redigera namn
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(doc.id, doc.storage_path)}
                              disabled={isDeletingId === doc.id}
                            >
                              {isDeletingId === doc.id ? "Tar bort..." : "Ta bort"}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Inga dokument i denna kategori ännu.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
