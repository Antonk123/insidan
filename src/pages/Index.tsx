import { Header } from "@/components/Header";
import { SafetyCounter } from "@/components/SafetyCounter";
import { QuickLinks } from "@/components/QuickLinks";
import { RecentDocuments } from "@/components/RecentDocuments";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Välkommen till Insidan</h2>
          <p className="text-muted-foreground">
            Hitta dokument, rutiner och resurser på ett ställe.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            <SafetyCounter />
            <QuickLinks />
          </div>
          
          {/* Right column - Recent documents */}
          <div className="lg:col-span-1">
            <RecentDocuments />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
