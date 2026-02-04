export type ProcessType = "core" | "support";

export interface ProcessItem {
  title: string;
  description: string;
  href: string;
  type: ProcessType;
}

export const PROCESS_ITEMS: ProcessItem[] = [
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
