import React from "react";
import { Link } from "react-router-dom";
import { Scale, Briefcase, Home, Building2, CheckCircle2 } from "lucide-react";

const solutions = [
  {
    icon: Scale,
    name: "Cabinets d'avocats",
    intro: "Trouvez les entreprises qui ont besoin de conseil juridique.",
    bullets: [
      "Détection d'entreprises en levée de fonds ou en M&A",
      "Personnalisation par domaine de droit (corporate, social, fiscal…)",
      "Synchronisation directe avec votre CRM ou Notion",
    ],
  },
  {
    icon: Briefcase,
    name: "Agences",
    intro: "Identifiez les marques qui investissent en marketing.",
    bullets: [
      "Détection des entreprises qui recrutent en marketing/sales",
      "Templates de pitch par typologie d'agence",
      "Pipeline visuel pour suivre les opportunités",
    ],
  },
  {
    icon: Home,
    name: "Immobilier",
    intro: "Ciblez les entreprises en croissance qui cherchent des locaux.",
    bullets: [
      "Recherche géolocalisée fine via Google Maps",
      "Score d'intention basé sur l'évolution d'effectifs",
      "Relances multi-canal automatisées",
    ],
  },
  {
    icon: Building2,
    name: "SaaS",
    intro: "Atteignez les décideurs B2B sur votre verticale.",
    bullets: [
      "Filtres par stack technique et taille d'équipe",
      "Emails ultra-personnalisés générés par IA",
      "Reporting de conversion par segment",
    ],
  },
];

export default function Solutions() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em]">
          Solutions
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2937]">
          Adapté à <span className="text-[#22819A]">chaque métier</span>.
        </h1>
        <p className="mt-4 text-[#1F2937]/70">
          GUEGON s'adapte à votre activité, votre cible et votre cycle de vente.
        </p>
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-6">
        {solutions.map((s) => (
          <div
            key={s.name}
            className="rounded-[24px] bg-white border border-[#CDD4DD] p-8 hover:border-[#90C2E7] transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <span className="h-14 w-14 rounded-[18px] bg-gradient-to-br from-[#90C2E7]/40 to-[#22819A]/15 text-[#22819A] inline-flex items-center justify-center shrink-0">
                <s.icon size={26} strokeWidth={1.75} />
              </span>
              <div>
                <h2 className="text-2xl font-semibold text-[#1F2937]">{s.name}</h2>
                <p className="mt-2 text-[#1F2937]/70">{s.intro}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {s.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#1F2937]/80">
                  <CheckCircle2 size={18} className="text-[#22819A] shrink-0 mt-0.5" strokeWidth={2} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[20px] bg-[#22819A] text-white font-medium hover:bg-[#1a6b82] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(34,129,154,0.35)] hover:-translate-y-0.5"
        >
          Tester sur mon secteur
        </Link>
      </div>
    </div>
  );
}
