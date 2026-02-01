import { useState } from "react";
import { FileText, FileSpreadsheet, File, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteDocument } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  url: string;
  is_external: boolean | null;
  is_new: boolean | null;
  created_at: string | null;
  categories: { name: string; slug: string } | null;
}

interface AdminDocumentCardProps {
  document: Document;
}

const documentTypeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  word: FileText,
  link: ExternalLink,
};

export function AdminDocumentCard({ document: doc }: AdminDocumentCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();
  const { toast } = useToast();

  const Icon = documentTypeIcons[doc.document_type] ?? File;
  const timeAgo = doc.created_at
    ? formatDistanceToNow(new Date(doc.created_at), {
        addSuffix: true,
        locale: sv,
      })
    : "";

  const handleDelete = () => {
    deleteDocument(doc.id, {
      onSuccess: () => {
        toast({
          title: "Dokument borttaget",
          description: `"${doc.title}" har tagits bort.`,
        });
        setDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Kunde inte ta bort",
          description: error instanceof Error ? error.message : "Något gick fel.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors group">
      <div className="p-2 bg-muted rounded-lg">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a
            href={doc.url}
            target={doc.is_external ? "_blank" : undefined}
            rel={doc.is_external ? "noopener noreferrer" : undefined}
            className="font-medium truncate hover:text-primary transition-colors"
          >
            {doc.title}
          </a>
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
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta bort dokument?</AlertDialogTitle>
            <AlertDialogDescription>
              Är du säker på att du vill ta bort "{doc.title}"? 
              Detta går inte att ångra.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Tar bort...
                </>
              ) : (
                "Ta bort"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
