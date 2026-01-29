import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Home, Folder, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { useCategoryBySlug, useCategories } from "@/hooks/useCategories";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentCard } from "@/components/DocumentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug ?? "");
  const { data: allCategories } = useCategories();
  const { data: documents, isLoading: documentsLoading } = useDocuments(category?.id);
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Get subcategories
  const subcategories = allCategories?.filter((cat) => cat.parent_id === category?.id);
  
  // Get parent category for breadcrumb
  const parentCategory = category?.parent_id 
    ? allCategories?.find((cat) => cat.id === category.parent_id)
    : null;

  const getDocumentType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "pdf") return "pdf";
    if (ext === "xls" || ext === "xlsx") return "excel";
    if (ext === "doc" || ext === "docx") return "word";
    return "file";
  };

  const bucketName = "insidan-bucket";

  const handleUpload = async () => {
    if (!user || !file || !category?.id) return;

    setIsUploading(true);
    try {
      const cleanName = file.name.replace(/\s+/g, "-");
      const path = `${category.slug}/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(path);

      const documentType = getDocumentType(file.name);
      const { error: insertError } = await supabase
        .from("documents")
        .insert({
          title: title.trim() || file.name,
          description: description.trim() || null,
          category_id: category.id,
          document_type: documentType,
          url: publicUrlData.publicUrl,
          is_external: false,
          is_public: true,
          is_new: true,
        });

      if (insertError) throw insertError;

      setFile(null);
      setTitle("");
      setDescription("");
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
        
        {/* Subcategories as cards */}
        {subcategories && subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              Underkategorier
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subcategories.map((subcat) => (
                <Link
                  key={subcat.id}
                  to={`/kategori/${subcat.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Folder className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {subcat.name}
                          </h3>
                          {subcat.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {subcat.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Documents with improved cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Dokument
          </h2>

          {user && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ladda upp dokument</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-title">Titel</Label>
                  <Input
                    id="upload-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titel (valfritt)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-description">Beskrivning</Label>
                  <Textarea
                    id="upload-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Beskrivning (valfritt)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-file">Fil</Label>
                  <Input
                    id="upload-file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <Button onClick={handleUpload} disabled={!file || isUploading}>
                  {isUploading ? "Laddar upp..." : "Ladda upp"}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {documentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
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
