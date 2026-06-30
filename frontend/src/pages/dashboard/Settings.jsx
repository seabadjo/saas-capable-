import React from "react";
import { useAuth } from "@/lib/auth";
import { User, Mail, Building, Shield } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1F2937]">Paramètres</h1>
      <p className="mt-1 text-sm text-[#1F2937]/65">Votre compte et préférences.</p>

      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-[24px] bg-white border border-[#CDD4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1F2937]">Profil</h2>
          <div className="mt-6 grid grid-cols-2 gap-5">
            <Field icon={User} label="Nom" value={user?.name || "—"} />
            <Field icon={Mail} label="Email" value={user?.email || "—"} />
            <Field icon={Building} label="Entreprise" value={user?.company || "—"} />
            <Field icon={Shield} label="Plan" value={user?.plan || "starter"} />
          </div>
        </div>

        <div className="rounded-[24px] bg-gradient-to-br from-[#22819A] to-[#1a6b82] p-6 text-white">
          <h2 className="text-lg font-semibold">Passez en Pro</h2>
          <p className="mt-2 text-sm text-white/80">
            Workflows illimités, 2 000 emails IA / mois et toutes les intégrations CRM.
          </p>
          <button className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-[14px] bg-white text-[#22819A] text-sm font-semibold hover:-translate-y-0.5 transition-all">
            Découvrir Pro
          </button>
        </div>
      </div>
    </div>
  );
}

const Field = ({ icon: Icon, label, value }) => (
  <div className="rounded-[16px] border border-[#CDD4DD] p-4 bg-[#FEF7F8]/50">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">
      <Icon size={14} strokeWidth={1.75} />
      {label}
    </div>
    <div className="mt-1.5 text-sm text-[#1F2937]">{value}</div>
  </div>
);
