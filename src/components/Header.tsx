import { useState, useEffect } from "react";
import { Search, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchDialog } from "@/components/SearchDialog";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAdmin, signOut, loading } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte logga ut. Försök igen.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Utloggad",
        description: "Du har loggats ut.",
      });
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold">
            <span className="text-primary">Insidan</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="relative w-64 justify-start text-muted-foreground hidden md:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Sök allt...</span>
            <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
          
          {loading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-32 truncate">
                    {user.email}
                  </span>
                  {isAdmin && <Shield className="h-3 w-3 text-primary" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem disabled className="text-xs">
                    <Shield className="h-3 w-3 mr-2 text-primary" />
                    Administratör
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logga ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Logga in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
