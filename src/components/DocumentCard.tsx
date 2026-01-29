import { useState } from "react";
import { FileText, FileSpreadsheet, File, ExternalLink, X, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  url: string;
  storage_path?: string | null;
  is_external: boolean;
  is_new: boolean;
  tags: string[] | null;
  created_at: string;
  categories: { name: string; slug: string } | null;
}

interface DocumentCardProps {
  document: Document;
}

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

const documentTypeColors: Record<string, string> = {
  pdf: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  excel: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  word: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  link: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function DocumentCard({ document: doc }: DocumentCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const Icon = documentTypeIcons[doc.document_type] ?? File;
  const typeColor = documentTypeColors[doc.document_type] ?? "bg-muted text-muted-foreground";
  const canPreview = doc.document_type === "pdf";
  
  const timeAgo = formatDistanceToNow(new Date(doc.created_at), {
    addSuffix: true,
    locale: sv,
  });

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewOpen(true);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const filenameFromPath = doc.storage_path?.split("/").pop();
    const filenameFromUrl = doc.url.split("?")[0].split("/").pop();
    const fallbackExt = doc.document_type === "pdf" ? ".pdf" : "";
    const fallbackName = `${doc.title}${fallbackExt}`;
    const filename = filenameFromPath || filenameFromUrl || fallbackName;

    try {
      setIsDownloading(true);
      const res = await fetch(doc.url);
      if (!res.ok) {
        throw new Error(`Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback to opening the file if the download fails
      window.open(doc.url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-all hover:border-primary/30">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Icon */}
            <div className={`p-3 rounded-lg flex-shrink-0 ${typeColor}`}>
              <Icon className="h-6 w-6" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {doc.title}
                    </h4>
                    {doc.is_new && (
                      <Badge variant="default" className="text-xs">
                        Ny
                      </Badge>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                </div>
                
                {/* Type badge */}
                <Badge variant="outline" className="flex-shrink-0">
                  {documentTypeLabels[doc.document_type] ?? doc.document_type}
                </Badge>
              </div>
              
              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {doc.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">
                  Tillagd {timeAgo}
                </span>
                
                <div className="flex gap-2">
                  {canPreview && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handlePreview}
                      className="h-8 px-3"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Förhandsgranska
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={canPreview ? "outline" : "default"}
                    onClick={handleDownload}
                    className="h-8 px-3"
                    disabled={isDownloading}
                  >
                    <>
                      {doc.is_external ? (
                        <ExternalLink className="h-4 w-4 mr-1" />
                      ) : (
                        <Download className="h-4 w-4 mr-1" />
                      )}
                      {isDownloading ? "Laddar..." : "Ladda ner"}
                    </>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span>{doc.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6">
          <iframe
            src={doc.url}
            className="w-full h-full rounded-lg border"
            title={doc.title}
          />
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}
