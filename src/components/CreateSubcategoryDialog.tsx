import { useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateCategory } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";

interface CreateSubcategoryDialogProps {
  parentId: string;
  parentSlug: string;
}

export function CreateSubcategoryDialog({
  parentId,
  parentSlug,
}: CreateSubcategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createCategory, isPending } = useCreateCategory();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Namn saknas",
        description: "Ange ett namn för mappen.",
        variant: "destructive",
      });
      return;
    }

    createCategory(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        parentId,
        parentSlug,
      },
      {
        onSuccess: () => {
          toast({
            title: "Mapp skapad",
            description: `"${name}" har lagts till.`,
          });
          setOpen(false);
          resetForm();
        },
        onError: (error) => {
          toast({
            title: "Kunde inte skapa mappen",
            description:
              error instanceof Error ? error.message : "Något gick fel.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Ny mapp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Skapa ny mapp</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Namn</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="T.ex. Rutiner, Blanketter, Heta arbeten"
              disabled={isPending}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning (valfritt)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kort beskrivning av mappens innehåll"
              disabled={isPending}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Skapar...
                </>
              ) : (
                "Skapa mapp"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
