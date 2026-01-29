import { Link } from "react-router-dom";
import { Home, ChevronRight, Folder } from "lucide-react";
import { Header } from "@/components/Header";
import { useCategories } from "@/hooks/useCategories";
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

export default function VLSPage() {
  const { data: categories, isLoading } = useCategories();
  
  // Filter to only show top-level categories
  const topLevelCategories = categories?.filter((cat) => !cat.parent_id);
  
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
              <BreadcrumbPage>VLS</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Verksamhetsledningssystem</h2>
          <p className="text-muted-foreground">
            Här hittar du alla dokument och rutiner organiserade efter process.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {topLevelCategories?.map((category) => (
              <Card key={category.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder className="h-5 w-5 text-primary" />
                    </div>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                  )}
                  <Link
                    to={`/kategori/${category.slug}`}
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    Visa dokument
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}