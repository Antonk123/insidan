import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Header } from "@/components/Header";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import { PROCESS_ITEMS, ProcessType } from "@/lib/processItems";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import "./VLSPage.css";

export default function VLSPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | ProcessType>("all");
  const { data: quickLinks, isLoading: quickLinksLoading } = useQuickLinks();
  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return PROCESS_ITEMS;
    return PROCESS_ITEMS.filter((item) => item.type === activeFilter);
  }, [activeFilter]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Hem
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>VLS</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="process-map">
          <div className="process-map__header">
            <p className="process-map__eyebrow">
              <span className="process-map__core-indicator" /> Röd tråd = huvudprocess
            </p>
            <h2>Vårt Ledningssystem – Prefabmästarna</h2>
            <p>Filtrera för att snabbt hitta rätt steg.</p>

            <div className="process-map__filters" role="tablist" aria-label="Filtrera processer">
              <button
                className={`process-filter ${activeFilter === "all" ? "is-active" : ""}`}
                data-filter="all"
                role="tab"
                aria-selected={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              >
                Alla
              </button>
              <button
                className={`process-filter ${activeFilter === "core" ? "is-active" : ""}`}
                data-filter="core"
                role="tab"
                aria-selected={activeFilter === "core"}
                onClick={() => setActiveFilter("core")}
              >
                Huvudprocesser
              </button>
              <button
                className={`process-filter ${activeFilter === "support" ? "is-active" : ""}`}
                data-filter="support"
                role="tab"
                aria-selected={activeFilter === "support"}
                onClick={() => setActiveFilter("support")}
              >
                Stödprocesser
              </button>
            </div>
          </div>

          <div className="process-map__grid" aria-live="polite">
            {filteredItems.map((item) => (
              <article
                key={`${item.type}-${item.title}`}
                className={`process-card process-card--${item.type}`}
                data-type={item.type}
              >
                <a className="process-card__link" href={item.href}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="process-actions">
          <div className="process-actions__intro">
            <p className="process-actions__eyebrow">Snabblänkar</p>
            <h3>Verktyg och dokument</h3>
            <p>Nå de mest använda stöddokumenten snabbare.</p>
          </div>

          <div className="process-actions__buttons">
            {quickLinksLoading ? (
              <>
                <div className="process-btn process-btn--skeleton" />
                <div className="process-btn process-btn--skeleton" />
                <div className="process-btn process-btn--skeleton" />
              </>
            ) : quickLinks && quickLinks.length > 0 ? (
              quickLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="process-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="process-btn__label">{link.title}</span>
                  <span className="process-btn__meta">{link.icon ?? "Länk"}</span>
                </a>
              ))
            ) : (
              <p className="process-actions__empty">
                Inga snabblänkar är konfigurerade ännu.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
