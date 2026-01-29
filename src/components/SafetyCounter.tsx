import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

export function SafetyCounter() {
  const { data: settings, isLoading } = useSiteSettings();
  
  const daysWithoutAccidents = settings?.days_without_accidents ?? "0";
  
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dagar utan olyckor
            </p>
            {isLoading ? (
              <Skeleton className="h-10 w-20 mt-1" />
            ) : (
              <p className="text-4xl font-bold text-primary">
                {daysWithoutAccidents}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
