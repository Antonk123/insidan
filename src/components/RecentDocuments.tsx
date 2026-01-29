import { FileText, FileSpreadsheet, File, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecentDocuments } from "@/hooks/useDocuments";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

const documentTypeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  word: FileText,
  link: ExternalLink,
};

export function RecentDocuments() {
  const { data: documents, isLoading } = useRecentDocuments(5);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Senaste dokument
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Senaste dokument
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Inga dokument har lagts till ännu.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Senaste dokument
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => {
            const Icon = documentTypeIcons[doc.document_type] ?? File;
            const timeAgo = formatDistanceToNow(new Date(doc.created_at), {
              addSuffix: true,
              locale: sv,
            });
            
            return (
              <a
                key={doc.id}
                href={doc.url}
                target={doc.is_external ? "_blank" : undefined}
                rel={doc.is_external ? "noopener noreferrer" : undefined}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo}
                  </p>
                </div>
                {doc.is_external && (
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
