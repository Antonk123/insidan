import { FileText, FileSpreadsheet, File, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { MoveDocumentDropdown } from "@/components/MoveDocumentDropdown";

type Document = Tables<"documents">;

interface DocumentCompactViewProps {
  documents: Document[];
  isAdmin: boolean;
  onEdit?: (docId: string, currentTitle: string) => void;
  onDelete?: (docId: string, storagePath?: string | null) => void;
  isDeletingId?: string | null;
}

const bucketName = "insidan-bucket";

function getDocumentIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="h-4 w-4 text-destructive" />;
    case "excel":
      return <FileSpreadsheet className="h-4 w-4 text-primary" />;
    case "word":
      return <FileText className="h-4 w-4 text-accent-foreground" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" />;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "pdf":
      return "PDF";
    case "excel":
      return "Excel";
    case "word":
      return "Word";
    default:
      return "Fil";
  }
}

function getDocumentUrl(doc: Document): string {
  if (doc.is_external) {
    return doc.url;
  }
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(doc.storage_path ?? doc.url);
  return data.publicUrl;
}

export function DocumentCompactView({
  documents,
  isAdmin,
  onEdit,
  onDelete,
  isDeletingId,
}: DocumentCompactViewProps) {
  const handleOpen = (doc: Document) => {
    const url = getDocumentUrl(doc);
    window.open(url, "_blank");
  };

  const handleDownload = async (doc: Document) => {
    const url = getDocumentUrl(doc);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dokument</TableHead>
            <TableHead className="w-20 hidden sm:table-cell">Typ</TableHead>
            <TableHead className="w-28 hidden md:table-cell">Datum</TableHead>
            <TableHead className="w-auto text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-2 min-w-0">
                  {getDocumentIcon(doc.document_type)}
                  <span className="truncate font-medium">{doc.title}</span>
                  {doc.is_new && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      Ny
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                {getTypeLabel(doc.document_type)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {doc.updated_at
                  ? formatDistanceToNow(new Date(doc.updated_at), {
                      addSuffix: true,
                      locale: sv,
                    })
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {doc.document_type === "pdf" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpen(doc)}
                      title="Förhandsgranska"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(doc)}
                    title="Ladda ner"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <MoveDocumentDropdown
                      documentId={doc.id}
                      documentTitle={doc.title}
                      currentCategoryId={doc.category_id}
                      variant="icon"
                    />
                  )}
                  {isAdmin && onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(doc.id, doc.title)}
                      title="Redigera namn"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdmin && onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(doc.id, doc.storage_path)}
                      disabled={isDeletingId === doc.id}
                      title="Ta bort"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
