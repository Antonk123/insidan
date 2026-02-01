import { useState, useEffect } from "react";
import { Search, FileText, FileSpreadsheet, File, ExternalLink } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDocuments } from "@/hooks/useDocuments";
import { useNavigate } from "react-router-dom";

const documentTypeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  excel: FileSpreadsheet,
  word: FileText,
  link: ExternalLink,
};

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { data: documents } = useDocuments();
  const navigate = useNavigate();

  const handleSelect = (url: string, isExternal: boolean) => {
    onOpenChange(false);
    if (isExternal) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Sök dokument..." />
      <CommandList>
        <CommandEmpty>Inga dokument hittades.</CommandEmpty>
        <CommandGroup heading="Dokument">
          {documents?.map((doc) => {
            const Icon = documentTypeIcons[doc.document_type] ?? File;
            return (
              <CommandItem
                key={doc.id}
                value={`${doc.title} ${doc.description || ""} ${doc.tags?.join(" ") || ""}`}
                onSelect={() => handleSelect(doc.url, doc.is_external ?? false)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{doc.title}</span>
                  {doc.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {doc.description}
                    </span>
                  )}
                </div>
                {doc.is_external && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto flex-shrink-0" />
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
