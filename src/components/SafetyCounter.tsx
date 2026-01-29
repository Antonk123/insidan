import { useEffect, useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

type TimerState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const toTimerState = (startDate: Date): TimerState => {
  const diff = Math.max(0, Date.now() - startDate.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const pad = (value: number) => String(value).padStart(2, "0");

export function SafetyCounter() {
  const { data: settings, isLoading, isError, error } = useSiteSettings();
  
  const daysWithoutAccidents = settings?.days_without_accidents ?? "0";
  const startDateValue = settings?.safety_start_date ?? "";
  const startDate = useMemo(() => {
    const parsed = startDateValue ? new Date(startDateValue) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  }, [startDateValue]);

  const [timer, setTimer] = useState<TimerState | null>(
    startDate ? toTimerState(startDate) : null
  );

  useEffect(() => {
    if (!startDate) {
      setTimer(null);
      return;
    }

    setTimer(toTimerState(startDate));
    const interval = window.setInterval(() => {
      setTimer(toTimerState(startDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startDate]);
  
  if (isError) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-destructive">
            Kunde inte hämta säkerhetsräknaren.
          </p>
          {error instanceof Error && (
            <p className="mt-1 text-xs text-muted-foreground break-words">
              {error.message}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-3 text-primary">
          <Shield className="h-5 w-5" />
          <p className="text-xs font-semibold tracking-[0.25em] uppercase">
            Säkerhetsuppföljning
          </p>
        </div>
        <h3 className="mt-2 text-center text-2xl font-semibold">
          Dagar utan olyckor med frånvaro OMF
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Räknat som LTI (Lost Time Injury = frånvaro minst 1 arbetsdag). Att rapportera risker och planera arbeten
          noggrant innan vi startar är avgörande för vår säkerhet.
        </p>

        {isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : timer ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-background p-4 text-center">
              <span className="block text-3xl font-semibold text-primary">
                {timer.days}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Dagar
              </span>
            </div>
            <div className="rounded-xl border bg-background p-4 text-center">
              <span className="block text-3xl font-semibold text-primary">
                {pad(timer.hours)}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Timmar
              </span>
            </div>
            <div className="rounded-xl border bg-background p-4 text-center">
              <span className="block text-3xl font-semibold text-primary">
                {pad(timer.minutes)}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Minuter
              </span>
            </div>
            <div className="rounded-xl border bg-background p-4 text-center">
              <span className="block text-3xl font-semibold text-primary">
                {pad(timer.seconds)}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Sekunder
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border bg-background p-6">
            <span className="text-sm text-muted-foreground">
              Dagar utan olyckor
            </span>
            <span className="text-3xl font-semibold text-primary">
              {daysWithoutAccidents}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
