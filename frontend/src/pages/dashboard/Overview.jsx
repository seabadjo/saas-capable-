import React, { useEffect, useState } from "react";
import { Users, Megaphone, MailOpen, CalendarCheck, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { DASH } from "@/constants/testIds";
import { useAuth } from "@/lib/auth";

const StatCard = ({ icon: Icon, label, value, testid, trend }) => (
  <div
    data-testid={testid}
    className="rounded-[20px] bg-white border border-[#CDD4DD] p-5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all"
  >
    <div className="flex items-center justify-between">
      <span className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-[#90C2E7]/40 to-[#22819A]/15 text-[#22819A] inline-flex items-center justify-center">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {trend && (
        <span className="text-xs font-semibold text-[#22819A] inline-flex items-center gap-1">
          <TrendingUp size={12} strokeWidth={2} /> {trend}
        </span>
      )}
    </div>
    <div className="mt-4 text-3xl font-bold text-[#1F2937]">{value}</div>
    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1F2937]/55">{label}</div>
  </div>
);

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats/overview").then(({ data }) => setStats(data)).catch(() => setStats({}));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">
            Bonjour, <span className="text-[#22819A]">{user?.name?.split(" ")[0] || "vous"}</span>
          </h1>
          <p className="mt-1 text-sm text-[#1F2937]/65">Voici un aperçu de votre activité.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Prospects totaux" value={stats?.total_prospects ?? "—"} testid={DASH.statTotalProspects} trend="+12%" />
        <StatCard icon={Megaphone} label="Campagnes" value={stats?.total_campaigns ?? "—"} testid={DASH.statCampaigns} />
        <StatCard icon={MailOpen} label="Taux d'ouverture" value={stats ? `${stats.open_rate}%` : "—"} testid={DASH.statOpenRate} trend="+4.2%" />
        <StatCard icon={CalendarCheck} label="RDV obtenus" value={stats?.meetings_booked ?? "—"} testid={DASH.statMeetings} />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[24px] bg-white border border-[#CDD4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1F2937]">Funnel de prospection</h2>
          <p className="mt-1 text-sm text-[#1F2937]/60">Conversion par étape (30 derniers jours)</p>

          <div className="mt-6 space-y-4">
            {[
              { label: "Prospects identifiés", value: 1000, color: "#90C2E7" },
              { label: "Emails envoyés", value: 820, color: "#7BB6DD" },
              { label: "Emails ouverts", value: 351, color: "#4FA0B8" },
              { label: "Réponses obtenues", value: 117, color: "#22819A" },
              { label: "Rendez-vous bookés", value: 31, color: "#1a6b82" },
            ].map((row, i) => {
              const max = 1000;
              const pct = Math.max(8, (row.value / max) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1F2937]">{row.label}</span>
                    <span className="font-semibold text-[#1F2937]">{row.value}</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-[#FEF7F8] border border-[#CDD4DD]/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: row.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] bg-white border border-[#CDD4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1F2937]">Activité récente</h2>
          <ul className="mt-5 space-y-4">
            {[
              { t: "Nouveau prospect ajouté", d: "Acme Corp · il y a 5 min" },
              { t: "Email IA généré", d: "Pour Lina Marketing · il y a 20 min" },
              { t: "Campagne 'Q1 Outbound' active", d: "il y a 1h" },
              { t: "5 nouvelles réponses", d: "il y a 2h" },
            ].map((x, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#22819A]" />
                <div>
                  <div className="text-sm text-[#1F2937]">{x.t}</div>
                  <div className="text-xs text-[#1F2937]/55">{x.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
