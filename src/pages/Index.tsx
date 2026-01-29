import { useState } from "react";
import { Header } from "@/components/Header";
import { SafetyCounter } from "@/components/SafetyCounter";
import { QuickLinks } from "@/components/QuickLinks";
import { RecentDocuments } from "@/components/RecentDocuments";
import { useAuthContext } from "@/contexts/AuthContext";
import { useIsFetching } from "@tanstack/react-query";

const Index = () => {
  const { user, session, isAdmin, loading } = useAuthContext();
  const isFetching = useIsFetching();
  const debugEnabled = new URLSearchParams(window.location.search).has("debug");
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  const sessionExpiresAt = session?.expires_at
    ? new Date(session.expires_at * 1000).toISOString()
    : "n/a";
  const [pingResult, setPingResult] = useState<string>("not run");
  const [pingBusy, setPingBusy] = useState(false);
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

  const runPing = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setPingResult("missing supabase env");
      return;
    }

    setPingBusy(true);
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);
      const headers: Record<string, string> = {
        apikey: supabaseKey,
      };
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const res = await fetch(
        `${supabaseUrl}/rest/v1/site_settings?select=id&limit=1`,
        { headers, signal: controller.signal }
      );
      window.clearTimeout(timeoutId);
      setPingResult(`${res.status} ${res.statusText}`);
    } catch (error) {
      setPingResult(error instanceof Error ? error.message : "unknown error");
    } finally {
      setPingBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Välkommen till Insidan</h2>
          <p className="text-muted-foreground">Hitta dokument, rutiner och resurser på ett ställe.</p>
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

        {debugEnabled && (
          <div className="mt-4 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            <div>Debug: on</div>
            <div>Auth loading: {String(loading)}</div>
            <div>User: {user?.email ?? "none"}</div>
            <div>User id: {user?.id ?? "none"}</div>
            <div>Admin: {String(isAdmin)}</div>
            <div>Session expires: {sessionExpiresAt}</div>
            <div>Queries fetching: {isFetching}</div>
            <div>Online: {String(isOnline)}</div>
            <div>Supabase URL set: {String(Boolean(supabaseUrl))}</div>
            <div>Supabase key set: {String(Boolean(supabaseKey))}</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="rounded border px-2 py-1 text-xs"
                onClick={runPing}
                disabled={pingBusy}
              >
                {pingBusy ? "Pinging..." : "Ping Supabase"}
              </button>
              <span>Ping result: {pingResult}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
