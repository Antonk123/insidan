import { FileText, FileSpreadsheet, File, ExternalLink, Workflow, FolderOpen } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDocuments } from "@/hooks/useDocuments";
import { useCategories } from "@/hooks/useCategories";
import { PROCESS_ITEMS } from "@/lib/processItems";
import { Badge } from "@/components/ui/badge";

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
  const { data: categories } = useCategories();

  const handleSelectDocument = (url: string, isExternal: boolean) => {
    onOpenChange(false);
    if (isExternal) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_blank");
    }
  };

  const handleSelectProcess = (href: string) => {
    onOpenChange(false);
    if (href.startsWith("/")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const handleSelectCategory = (slug: string) => {
    onOpenChange(false);
    window.location.href = `/kategori/${slug}`;
  };

  // Get parent categories (folders/pages)
  const parentCategories = categories?.filter((c) => !c.parent_id) ?? [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Sök processer, kategorier och dokument..." />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>Inga resultat hittades.</CommandEmpty>

        {/* Processes */}
        <CommandGroup heading="Processer (VLS)">
          {PROCESS_ITEMS.map((process) => (
            <CommandItem
              key={process.href}
              value={`process ${process.title} ${process.description}`}
              onSelect={() => handleSelectProcess(process.href)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Workflow className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium truncate">{process.title}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {process.description}
                </span>
              </div>
              <Badge
                variant={process.type === "core" ? "default" : "secondary"}
                className="ml-auto flex-shrink-0 text-[10px]"
              >
                {process.type === "core" ? "Huvudprocess" : "Stöd"}
              </Badge>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Categories */}
        <CommandGroup heading="Kategorier">
          {parentCategories.map((category) => (
            <CommandItem
              key={category.id}
              value={`kategori ${category.name} ${category.description || ""}`}
              onSelect={() => handleSelectCategory(category.slug)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">{category.name}</span>
                {category.description && (
                  <span className="text-xs text-muted-foreground truncate">
                    {category.description}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Documents */}
        <CommandGroup heading="Dokument">
          {documents?.map((doc) => {
            const Icon = documentTypeIcons[doc.document_type] ?? File;
            const categoryName = doc.categories?.name;
            return (
              <CommandItem
                key={doc.id}
                value={`dokument ${doc.title} ${doc.description || ""} ${doc.tags?.join(" ") || ""} ${categoryName || ""}`}
                onSelect={() => handleSelectDocument(doc.url, doc.is_external ?? false)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium truncate">{doc.title}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {categoryName && <span className="mr-2">{categoryName}</span>}
                    {doc.description}
                  </span>
                </div>
                {doc.is_new && (
                  <Badge variant="outline" className="ml-auto flex-shrink-0 text-[10px]">
                    Ny
                  </Badge>
                )}
                {doc.is_external && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
