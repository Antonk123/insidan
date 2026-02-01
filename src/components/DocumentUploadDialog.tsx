import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadDocument } from "@/hooks/useDocuments";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";

export function DocumentUploadDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isPublic, setIsPublic] = useState(true);

  const { mutate: uploadDocument, isPending } = useUploadDocument();
  const { data: categories } = useCategories();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "Ingen fil vald",
        description: "Välj en fil att ladda upp.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Titel saknas",
        description: "Ange en titel för dokumentet.",
        variant: "destructive",
      });
      return;
    }

    uploadDocument(
      {
        file,
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId: categoryId || undefined,
        isPublic,
      },
      {
        onSuccess: () => {
          toast({
            title: "Dokument uppladdat",
            description: `"${title}" har laddats upp.`,
          });
          setOpen(false);
          resetForm();
        },
        onError: (error) => {
          toast({
            title: "Uppladdning misslyckades",
            description: error instanceof Error ? error.message : "Något gick fel.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setCategoryId("");
    setIsPublic(true);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Ladda upp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ladda upp dokument</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fil</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              disabled={isPending}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Vald fil: {file.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dokumentets titel"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning (valfritt)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kort beskrivning av dokumentet"
              disabled={isPending}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori (valfritt)</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Välj kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Ingen kategori</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
              disabled={isPending}
            />
            <Label htmlFor="isPublic" className="text-sm font-normal">
              Offentligt dokument (synligt för alla)
            </Label>
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
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Laddar upp...
                </>
              ) : (
                "Ladda upp"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
