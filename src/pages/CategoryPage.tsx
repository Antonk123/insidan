import { useParams, Link } from "react-router-dom";
import { FileText, FileSpreadsheet, File, ExternalLink, ChevronRight, Home } from "lucide-react";
import { Header } from "@/components/Header";
import { useCategoryBySlug, useCategories } from "@/hooks/useCategories";
import { useDocuments } from "@/hooks/useDocuments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const documentTypeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  word: FileText,
  link: ExternalLink,
};

const documentTypeLabels: Record<string, string> = {
  pdf: "PDF",
  excel: "Excel",
  word: "Word",
  link: "Länk",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug ?? "");
  const { data: allCategories } = useCategories();
  const { data: documents, isLoading: documentsLoading } = useDocuments(category?.id);
  
  // Get subcategories
  const subcategories = allCategories?.filter((cat) => cat.parent_id === category?.id);
  
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
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
        
        {/* Subcategories */}
        {subcategories && subcategories.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Underkategorier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {subcategories.map((subcat) => (
                  <Link
                    key={subcat.id}
                    to={`/kategori/${subcat.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {subcat.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Dokument</CardTitle>
          </CardHeader>
          <CardContent>
            {documentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const Icon = documentTypeIcons[doc.document_type] ?? File;
                  
                  return (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target={doc.is_external ? "_blank" : undefined}
                      rel={doc.is_external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                            {doc.title}
                          </h4>
                          {doc.is_new && (
                            <Badge variant="default" className="text-xs">
                              Ny
                            </Badge>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {documentTypeLabels[doc.document_type] ?? doc.document_type}
                      </Badge>
                      {doc.is_external && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Inga dokument i denna kategori ännu.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
