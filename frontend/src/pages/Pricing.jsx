import React from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Rocket, Building } from "lucide-react";
import { LANDING } from "@/constants/testIds";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Sparkles,
    price: "29",
    desc: "Pour démarrer en solo.",
    features: [
      "500 prospects / mois",
      "200 emails IA / mois",
      "1 workflow d'automatisation",
      "Sync HubSpot + Notion",
      "Support email",
    ],
    cta: "Démarrer",
    highlight: false,
    testid: LANDING.pricingCardStarter,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Rocket,
    price: "79",
    desc: "Pour les équipes en croissance.",
    features: [
      "5 000 prospects / mois",
      "2 000 emails IA / mois",
      "Workflows illimités",
      "Toutes les intégrations CRM",
      "Multi-utilisateurs (5 sièges)",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlight: true,
    testid: LANDING.pricingCardPro,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building,
    price: "Sur devis",
    desc: "Pour les organisations exigeantes.",
    features: [
      "Prospects illimités",
      "Emails IA illimités",
      "SSO + permissions avancées",
      "API & webhooks dédiés",
      "SLA 99,9% & CSM dédié",
      "Onboarding personnalisé",
    ],
    cta: "Nous contacter",
    highlight: false,
    testid: LANDING.pricingCardEnterprise,
  },
];

export default function Pricing() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em]">
          Tarifs
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2937]">
          Des prix <span className="text-[#22819A]">transparents</span>.
        </h1>
        <p className="mt-4 text-[#1F2937]/70">
          Sans engagement. Annulez à tout moment. 14 jours d'essai sur tous les plans.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            data-testid={p.testid}
            className={`relative rounded-[24px] p-8 border transition-all duration-300 ${
              p.highlight
                ? "bg-white border-[#22819A] shadow-[0_30px_60px_rgba(34,129,154,0.18)] scale-[1.02]"
                : "bg-white border-[#CDD4DD] hover:border-[#90C2E7] hover:-translate-y-1"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#22819A] text-white text-xs font-semibold uppercase tracking-[0.18em]">
                Plus populaire
              </span>
            )}
            <span className="h-12 w-12 rounded-[16px] bg-gradient-to-br from-[#90C2E7]/40 to-[#22819A]/15 text-[#22819A] inline-flex items-center justify-center">
              <p.icon size={22} strokeWidth={1.75} />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-[#1F2937]">{p.name}</h2>
            <p className="mt-1 text-sm text-[#1F2937]/65">{p.desc}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#1F2937]">
                {p.price === "Sur devis" ? p.price : `${p.price}€`}
              </span>
              {p.price !== "Sur devis" && (
                <span className="text-sm text-[#1F2937]/60">/ mois</span>
              )}
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#1F2937]/80">
                  <Check size={16} className="text-[#22819A] mt-0.5 shrink-0" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={p.id === "enterprise" ? "/contact" : "/register"}
              className={`mt-8 w-full inline-flex items-center justify-center px-6 py-3 rounded-[20px] font-medium transition-all duration-300 ${
                p.highlight
                  ? "bg-[#22819A] text-white hover:bg-[#1a6b82] hover:-translate-y-0.5"
                  : "border border-[#CDD4DD] text-[#1F2937] hover:border-[#22819A]"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-[#1F2937]/60">
        Tous les prix s'entendent hors taxes. Paiement mensuel ou annuel (-20%).
      </p>
    </div>
  );
}
