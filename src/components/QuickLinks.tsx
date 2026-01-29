import { Building, LayoutDashboard, Phone, Headphones, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  building: Building,
  "layout-dashboard": LayoutDashboard,
  phone: Phone,
  headphones: Headphones,
};

export function QuickLinks() {
  const { data: links, isLoading } = useQuickLinks();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Snabblänkar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Snabblänkar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links?.map((link) => {
            const Icon = iconMap[link.icon ?? ""] ?? ExternalLink;
            return (
              <a
                key={link.id}
                href={link.url}
                className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center group"
              >
                <Icon className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{link.title}</span>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
