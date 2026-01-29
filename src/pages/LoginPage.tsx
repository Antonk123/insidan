import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: "Konto skapat!",
          description: "Du är nu inloggad.",
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Välkommen tillbaka!",
          description: "Du är nu inloggad.",
        });
      }
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm text-muted-foreground">Tillbaka</span>
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? "Skapa konto" : "Logga in"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Fyll i dina uppgifter för att skapa ett konto"
              : "Ange din e-post och lösenord för att logga in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="namn@prefabmastarna.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Laddar..."
                : isSignUp
                ? "Skapa konto"
                : "Logga in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Har du redan ett konto?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsSignUp(false)}
                >
                  Logga in
                </button>
              </>
            ) : (
              <>
                Inget konto?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsSignUp(true)}
                >
                  Skapa ett konto
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
