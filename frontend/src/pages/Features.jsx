import React from "react";
import {
  Search, Mail, ShieldCheck, RefreshCw, Wand2, BarChart3,
  Users, Plug, Bell, Workflow,
} from "lucide-react";

const groups = [
  {
    title: "Trouver",
    items: [
      { icon: Search, name: "Lead Finder", desc: "Recherche d'entreprises ciblées via Google Maps." },
      { icon: Mail, name: "Email Finder", desc: "Trouvez les emails des décideurs en un clic." },
      { icon: ShieldCheck, name: "Email Verification", desc: "Validation et scoring de délivrabilité." },
    ],
  },
  {
    title: "Engager",
    items: [
      { icon: Wand2, name: "AI Personalization", desc: "Emails personnalisés via Claude Sonnet 4.5." },
      { icon: Workflow, name: "Campaign Builder", desc: "Séquences multi-canal avec relances." },
      { icon: Bell, name: "Notifications", desc: "Alertes Email, Slack, Discord." },
    ],
  },
  {
    title: "Connecter",
    items: [
      { icon: RefreshCw, name: "CRM Sync", desc: "HubSpot, Salesforce, Pipedrive, Notion, Airtable." },
      { icon: Plug, name: "API REST", desc: "Webhooks et endpoints pour votre stack." },
      { icon: Users, name: "Team Workspace", desc: "Collaboration multi-utilisateurs." },
    ],
  },
  {
    title: "Mesurer",
    items: [
      { icon: BarChart3, name: "Reports", desc: "Ouvertures, clics, réponses, conversions." },
    ],
  },
];

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em]">
          Fonctionnalités
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2937]">
          Une plateforme, <span className="text-[#22819A]">tout votre tunnel</span>.
        </h1>
        <p className="mt-4 text-[#1F2937]/70">
          Tous les outils dont vous avez besoin pour automatiser votre prospection B2B
          de bout en bout.
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="text-2xl font-semibold text-[#1F2937]">{g.title}</h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {g.items.map((f) => (
                <div
                  key={f.name}
                  className="rounded-[20px] bg-white border border-[#CDD4DD] p-6 hover:border-[#90C2E7] hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="h-11 w-11 rounded-[14px] bg-gradient-to-br from-[#90C2E7]/40 to-[#22819A]/15 text-[#22819A] inline-flex items-center justify-center">
                    <f.icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#1F2937]">{f.name}</h3>
                  <p className="mt-2 text-sm text-[#1F2937]/70">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
