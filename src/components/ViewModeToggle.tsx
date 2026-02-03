import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = "compact" | "cards";

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as ViewMode);
      }}
      className="border rounded-md"
    >
      <ToggleGroupItem
        value="compact"
        aria-label="Kompakt vy"
        className="gap-1.5 px-3"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Kompakt</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="cards"
        aria-label="Kortvy"
        className="gap-1.5 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Kort</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
