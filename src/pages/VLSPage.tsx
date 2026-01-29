import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Header } from "@/components/Header";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import "./VLSPage.css";

type ProcessType = "core" | "support";

const PROCESS_ITEMS: Array<{
  title: string;
  description: string;
  href: string;
  type: ProcessType;
}> = [
  {
    title: "Affärsidé och Policy",
    description: "Grundläggande riktning för verksamheten.",
    href: "/kategori/affarside-och-policy",
    type: "support",
  },
  {
    title: "Mål och Mättetal",
    description: "Nyckeltal som säkerställer att vi rör oss mot strategin.",
    href: "http://insidan.pitea.local/?page_id=228",
    type: "support",
  },
  {
    title: "Handlingsplan",
    description: "Planerade aktiviteter för att nå målen.",
    href: "http://insidan.pitea.local/?page_id=230",
    type: "support",
  },
  {
    title: "Organisation",
    description: "Roller, ansvar och struktur.",
    href: "http://insidan.pitea.local/?page_id=232",
    type: "support",
  },
  {
    title: "Ansvar och Befogenheter",
    description: "Tydliggör vem som beslutar vad.",
    href: "http://insidan.pitea.local/?page_id=234",
    type: "support",
  },
  {
    title: "Lagar och Krav",
    description: "Regelverk som styr vår verksamhet.",
    href: "http://insidan.pitea.local/?page_id=236",
    type: "support",
  },
  {
    title: "Kommunikation",
    description: "Intern och extern informationsdelning.",
    href: "http://insidan.pitea.local/?page_id=238",
    type: "support",
  },
  {
    title: "Ledning och Genomgång",
    description: "Ledningens genomgångar och uppföljning.",
    href: "http://insidan.pitea.local/?page_id=240",
    type: "support",
  },
  {
    title: "Förfrågan",
    description: "Inkommande behov från kund eller intern beställare.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-321.pdf",
    type: "core",
  },
  {
    title: "Anbudskalkyl",
    description: "Kalkylering och prisförslag.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-322.pdf",
    type: "core",
  },
  {
    title: "Anbud",
    description: "Offertarbete och överlämning.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-323.pdf",
    type: "core",
  },
  {
    title: "Avtal",
    description: "Kontraktskrivning och villkor.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-324.pdf",
    type: "core",
  },
  {
    title: "Projektadministration",
    description: "Planering, dokumentstyrning och resursbokning.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-326.pdf",
    type: "core",
  },
  {
    title: "Projekt Genomförande",
    description: "Produktion, montage och ändringshantering.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-328.pdf",
    type: "core",
  },
  {
    title: "Hantering och Leverans",
    description: "Logistik, leverans och mottagning hos kund.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-329.pdf",
    type: "core",
  },
  {
    title: "Faktura",
    description: "Debitering och ekonomisk uppföljning.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-543.pdf",
    type: "core",
  },
  {
    title: "Tidplaner & Sammanfattning",
    description: "Projektstängning, lärdomar och rapportering.",
    href: "http://insidan.pitea.local/VLS/PUBLICERADE/SR5.2-320.pdf",
    type: "core",
  },
  {
    title: "Personalhandbok",
    description: "Policyer, rutiner och onboarding.",
    href: "http://insidan.pitea.local/?page_id=260",
    type: "support",
  },
  {
    title: "Arbetsmiljö",
    description: "Systematiskt arbetsmiljöarbete.",
    href: "http://insidan.pitea.local/?page_id=262",
    type: "support",
  },
  {
    title: "Miljö",
    description: "Miljörutiner och uppföljning.",
    href: "http://insidan.pitea.local/?page_id=264",
    type: "support",
  },
  {
    title: "Inköp",
    description: "Beställningar, leverantörer och avtal.",
    href: "http://insidan.pitea.local/?page_id=268",
    type: "support",
  },
  {
    title: "Service och Underhåll",
    description: "Maskiner, utrustning och förebyggande service.",
    href: "http://insidan.pitea.local/?page_id=270",
    type: "support",
  },
  {
    title: "Uppföljning och Kontroll",
    description: "Revisioner, kontroller och mätetal.",
    href: "http://insidan.pitea.local/?page_id=272",
    type: "support",
  },
  {
    title: "Avvikelsehantering",
    description: "Upptäcka, rapportera och åtgärda avvikelser.",
    href: "http://insidan.pitea.local/?page_id=274",
    type: "support",
  },
];

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
