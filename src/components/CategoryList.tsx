import { Folder, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryList() {
  const { data: categories, isLoading } = useCategories();
  
  // Filter to only show top-level categories
  const topLevelCategories = categories?.filter((cat) => !cat.parent_id);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Dokumentkategorier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Dokumentkategorier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topLevelCategories?.map((category) => (
            <Link
              key={category.id}
              to={`/kategori/${category.slug}`}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
