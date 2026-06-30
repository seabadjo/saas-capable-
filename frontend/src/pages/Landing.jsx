import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Search, Mail, ShieldCheck, RefreshCw, Wand2, Sparkles,
  BarChart3, Users, Plug, Bell, Workflow, Building2, Scale, Home, Briefcase,
  CheckCircle2, Zap, TrendingUp
} from "lucide-react";
import { LANDING } from "@/constants/testIds";

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em]">
    <Sparkles size={12} strokeWidth={1.75} /> {children}
  </span>
);

const featureCards = [
  { icon: Search, title: "Lead Finder", desc: "Recherche d'entreprises ciblées via Google Maps et bases publiques." },
  { icon: Mail, title: "Email Finder", desc: "Trouvez l'email professionnel des décideurs en un clic." },
  { icon: ShieldCheck, title: "Email Verification", desc: "Validez chaque adresse pour préserver votre délivrabilité." },
  { icon: RefreshCw, title: "CRM Sync", desc: "Synchronisation HubSpot, Salesforce, Pipedrive, Notion, Airtable." },
  { icon: Workflow, title: "Campaign Builder", desc: "Séquences multi-canal avec relances et conditions." },
  { icon: Wand2, title: "AI Personalization", desc: "Emails ultra-personnalisés générés par Claude Sonnet 4.5." },
  { icon: BarChart3, title: "Reports", desc: "Tableaux de bord clairs : ouvertures, clics, réponses, RDV." },
  { icon: Users, title: "Team Workspace", desc: "Collaborez avec votre équipe sur les mêmes pipelines." },
  { icon: Plug, title: "API REST", desc: "Branchez GUEGON à n'importe quel outil de votre stack." },
  { icon: Bell, title: "Notifications", desc: "Alertes en temps réel via Email, Slack ou Discord." },
];

const solutions = [
  { icon: Scale, name: "Cabinets d'avocats", text: "Identifiez les entreprises qui ont besoin de conseil juridique." },
  { icon: Briefcase, name: "Agences", text: "Détectez les marques qui investissent en marketing." },
  { icon: Home, name: "Immobilier", text: "Ciblez les entreprises en croissance qui cherchent des locaux." },
  { icon: Building2, name: "SaaS", text: "Atteignez les décideurs B2B sur votre marché vertical." },
];

const stats = [
  { value: "+312%", label: "de prospects qualifiés en moyenne" },
  { value: "42%", label: "taux d'ouverture des emails IA" },
  { value: "8h", label: "économisées par commercial / semaine" },
];

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <Pill>Nouveau · IA Claude Sonnet 4.5</Pill>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F2937] leading-[1.05]">
              Automatisez votre prospection.<br />
              <span className="text-[#22819A]">Accélérez votre croissance.</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-[#1F2937]/70 max-w-xl leading-relaxed">
              GUEGON trouve vos prospects, enrichit leurs données, rédige des
              emails personnalisés avec l'IA et synchronise tout avec votre CRM —
              en un seul flux automatisé.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                data-testid={LANDING.heroCtaPrimary}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-[20px] bg-[#22819A] text-white font-medium hover:bg-[#1a6b82] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(34,129,154,0.35)] hover:-translate-y-0.5"
              >
                Commencer gratuitement
                <ArrowRight size={18} strokeWidth={1.75} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                data-testid={LANDING.heroCtaSecondary}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[20px] border border-[#CDD4DD] bg-white text-[#1F2937] font-medium hover:border-[#22819A] transition-all duration-300"
              >
                Voir la démo
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-[#1F2937]/60">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#22819A]" strokeWidth={2} /> Sans carte bancaire</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#22819A]" strokeWidth={2} /> Configuration en 3 min</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#22819A]" strokeWidth={2} /> Annulation libre</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#90C2E7]/30 to-[#22819A]/10 rounded-[28px] blur-2xl" />
              <div className="relative glass-card rounded-[24px] p-6 shadow-[0_20px_60px_rgba(34,129,154,0.15)]">
                <div className="flex items-center justify-between pb-4 border-b border-[#CDD4DD]/60">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#22819A]" />
                    <span className="text-xs font-semibold text-[#1F2937]">Workflow actif</span>
                  </div>
                  <span className="text-xs text-[#1F2937]/50">en direct</span>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {[
                    { icon: Search, text: "247 entreprises trouvées à Lyon" },
                    { icon: Mail, text: "189 emails vérifiés (76%)" },
                    { icon: Wand2, text: "189 emails personnalisés par IA" },
                    { icon: TrendingUp, text: "31 rendez-vous bookés ce mois" },
                  ].map((s, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 rounded-[16px] bg-[#FEF7F8] border border-[#CDD4DD]/40">
                      <span className="h-9 w-9 rounded-[14px] bg-[#22819A] text-white flex items-center justify-center">
                        <s.icon size={16} strokeWidth={1.75} />
                      </span>
                      <span className="text-sm text-[#1F2937]">{s.text}</span>
                      <CheckCircle2 size={16} className="ml-auto text-[#22819A]" strokeWidth={2} />
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {stats.slice(0, 3).map((s, i) => (
                    <div key={i} className="rounded-[16px] bg-white border border-[#CDD4DD]/60 p-3 text-center">
                      <div className="text-lg font-bold text-[#22819A]">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by stats band */}
      <section className="border-y border-[#CDD4DD]/60 bg-white/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-3xl lg:text-4xl font-bold text-[#22819A]">{s.value}</div>
              <div className="mt-1 text-sm text-[#1F2937]/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-2xl">
          <Pill>Fonctionnalités</Pill>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight text-[#1F2937]">
            Tout ce qu'il faut pour <span className="text-[#22819A]">prospecter intelligemment</span>.
          </h2>
          <p className="mt-4 text-[#1F2937]/70">
            Une suite complète — recherche, enrichissement, IA, automatisation et
            analytics — pour générer des leads B2B qualifiés sans effort.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((f, i) => (
            <div
              key={i}
              className="group rounded-[20px] bg-white border border-[#CDD4DD] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(34,129,154,0.08)] hover:-translate-y-1 hover:border-[#90C2E7] transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-[16px] bg-gradient-to-br from-[#90C2E7]/40 to-[#22819A]/15 text-[#22819A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <f.icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#1F2937]">{f.title}</h3>
              <p className="mt-2 text-sm text-[#1F2937]/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="bg-white/50 border-y border-[#CDD4DD]/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="max-w-2xl">
            <Pill>Solutions par secteur</Pill>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-[#1F2937]">
              Pensé pour <span className="text-[#22819A]">votre métier</span>.
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {solutions.map((s, i) => (
              <div
                key={i}
                className="rounded-[20px] p-6 bg-[#FEF7F8] border border-[#CDD4DD] hover:border-[#22819A] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="h-11 w-11 rounded-[14px] bg-[#22819A] text-white inline-flex items-center justify-center">
                  <s.icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#1F2937]">{s.name}</h3>
                <p className="mt-2 text-sm text-[#1F2937]/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-2xl">
          <Pill>Comment ça marche</Pill>
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-[#1F2937]">
            Du prospect au rendez-vous en <span className="text-[#22819A]">4 étapes</span>.
          </h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Définissez votre cible", d: "Secteur, ville, taille, mots-clés." },
            { n: "02", t: "On trouve les entreprises", d: "Google Maps, bases publiques, LinkedIn." },
            { n: "03", t: "L'IA rédige les emails", d: "Personnalisés, courts, efficaces." },
            { n: "04", t: "Vous récoltez les RDV", d: "Réponses centralisées dans votre CRM." },
          ].map((s, i) => (
            <div key={i} className="relative rounded-[20px] p-6 bg-white border border-[#CDD4DD]">
              <div className="text-xs font-semibold tracking-[0.2em] text-[#90C2E7]">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold text-[#1F2937]">{s.t}</h3>
              <p className="mt-2 text-sm text-[#1F2937]/70">{s.d}</p>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-[#CDD4DD]" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#22819A] to-[#1a6b82] p-12 lg:p-16">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Zap className="text-[#90C2E7]" size={28} strokeWidth={1.75} />
              <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white">
                Prêt à booster votre pipeline commercial ?
              </h2>
              <p className="mt-4 text-white/80 max-w-xl">
                Essayez GUEGON gratuitement. Aucune carte requise. Configurez votre
                premier workflow en 3 minutes.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-[20px] bg-white text-[#22819A] font-semibold hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-all duration-300"
              >
                Créer mon compte
                <ArrowRight size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
