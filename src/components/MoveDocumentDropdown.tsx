import { useState } from "react";
import { FolderInput, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";
import { useMoveDocument } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

interface MoveDocumentDropdownProps {
  documentId: string;
  documentTitle: string;
  currentCategoryId: string | null;
  variant?: "icon" | "button";
}

export function MoveDocumentDropdown({
  documentId,
  documentTitle,
  currentCategoryId,
  variant = "icon",
}: MoveDocumentDropdownProps) {
  const [open, setOpen] = useState(false);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { mutate: moveDocument, isPending } = useMoveDocument();
  const { toast } = useToast();

  // Build a hierarchy of categories for display
  const getCategoryPath = (categoryId: string): string => {
    const category = categories?.find((c) => c.id === categoryId);
    if (!category) return "";
    
    if (category.parent_id) {
      const parentPath = getCategoryPath(category.parent_id);
      return parentPath ? `${parentPath} / ${category.name}` : category.name;
    }
    return category.name;
  };

  // Sort categories by their path for better organization
  const sortedCategories = categories
    ?.map((cat) => ({
      ...cat,
      path: getCategoryPath(cat.id),
    }))
    .sort((a, b) => a.path.localeCompare(b.path, "sv"));

  const handleMove = (targetCategoryId: string) => {
    if (targetCategoryId === currentCategoryId) {
      setOpen(false);
      return;
    }

    const targetCategory = categories?.find((c) => c.id === targetCategoryId);
    
    moveDocument(
      { documentId, categoryId: targetCategoryId },
      {
        onSuccess: () => {
          toast({
            title: "Dokument flyttat",
            description: `"${documentTitle}" har flyttats till ${targetCategory?.name ?? "ny mapp"}.`,
          });
          setOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Kunde inte flytta dokument",
            description: error instanceof Error ? error.message : "Något gick fel.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Flytta till mapp"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FolderInput className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Flyttar...
              </>
            ) : (
              <>
                <FolderInput className="h-4 w-4 mr-2" />
                Flytta
              </>
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto bg-popover">
        <DropdownMenuLabel>Flytta till mapp</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : sortedCategories && sortedCategories.length > 0 ? (
          sortedCategories.map((cat) => (
            <DropdownMenuItem
              key={cat.id}
              onClick={() => handleMove(cat.id)}
              disabled={isPending}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="truncate">{cat.path}</span>
              {cat.id === currentCategoryId && (
                <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Inga mappar tillgängliga
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
