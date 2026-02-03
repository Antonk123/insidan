import { useState } from "react";
import { Link } from "react-router-dom";
import { Folder, ChevronRight, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { CreateSubcategoryDialog } from "./CreateSubcategoryDialog";
import { useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Category = Tables<"categories">;

interface SubcategoryManagerProps {
  subcategories: Category[];
  parentCategoryId: string;
  parentSlug: string;
  isAdmin: boolean;
}

export function SubcategoryManager({
  subcategories,
  parentCategoryId,
  parentSlug,
  isAdmin,
}: SubcategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { toast } = useToast();

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = (catId: string) => {
    if (!editingName.trim()) {
      toast({
        title: "Namn saknas",
        description: "Mappnamnet kan inte vara tomt.",
        variant: "destructive",
      });
      return;
    }

    updateCategory(
      { id: catId, name: editingName.trim() },
      {
        onSuccess: () => {
          toast({
            title: "Mapp uppdaterad",
            description: "Mappnamnet har ändrats.",
          });
          handleCancelEdit();
        },
        onError: (error) => {
          toast({
            title: "Kunde inte uppdatera",
            description:
              error instanceof Error ? error.message : "Något gick fel.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = (catId: string) => {
    deleteCategory(catId, {
      onSuccess: () => {
        toast({
          title: "Mapp borttagen",
          description: "Mappen har raderats.",
        });
      },
      onError: (error) => {
        toast({
          title: "Kunde inte ta bort",
          description:
            error instanceof Error ? error.message : "Något gick fel.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          Undermappar
        </h2>
        {isAdmin && (
          <CreateSubcategoryDialog
            parentId={parentCategoryId}
            parentSlug={parentSlug}
          />
        )}
      </div>

      {subcategories.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Folder className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Inga undermappar ännu.
              {isAdmin && " Klicka på \"Ny mapp\" för att skapa en."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((subcat) => (
            <Card
              key={subcat.id}
              className="hover:shadow-md hover:border-primary/30 transition-all"
            >
              <CardContent className="p-4">
                {editingId === subcat.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-8"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(subcat.id);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleSaveEdit(subcat.id)}
                      disabled={isUpdating}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/kategori/${subcat.slug}`}
                      className="flex items-center gap-3 flex-1 min-w-0 group"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                          {subcat.name}
                        </h3>
                        {subcat.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {subcat.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </Link>

                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault();
                            handleStartEdit(subcat);
                          }}
                          title="Redigera namn"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              title="Ta bort mapp"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Ta bort "{subcat.name}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Mappen kan endast tas bort om den är tom.
                                Eventuella dokument och undermappar måste tas
                                bort först.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(subcat.id)}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Ta bort
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
