import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { AUTH } from "@/constants/testIds";
import { Rocket, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.ok) navigate("/dashboard", { replace: true });
    else setError(res.error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <h1 className="mt-10 text-3xl font-bold tracking-tight text-[#1F2937]">
            Créez votre compte
          </h1>
          <p className="mt-2 text-sm text-[#1F2937]/70">
            14 jours d'essai. Sans carte bancaire.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Nom complet</label>
              <input
                required
                value={form.name}
                onChange={update("name")}
                data-testid={AUTH.registerName}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Entreprise</label>
              <input
                value={form.company}
                onChange={update("company")}
                data-testid={AUTH.registerCompany}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                data-testid={AUTH.registerEmail}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
                placeholder="vous@entreprise.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Mot de passe</label>
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={update("password")}
                data-testid={AUTH.registerPassword}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
                placeholder="6 caractères minimum"
              />
            </div>

            {error && (
              <div
                data-testid={AUTH.errorMsg}
                className="rounded-[14px] bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid={AUTH.registerSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] bg-[#22819A] text-white font-medium hover:bg-[#1a6b82] disabled:opacity-60 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(34,129,154,0.3)] hover:-translate-y-0.5"
            >
              <Rocket size={18} strokeWidth={1.75} />
              {loading ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#1F2937]/70">
            Déjà un compte ?{" "}
            <Link to="/login" className="font-semibold text-[#22819A] hover:underline">
              Se connecter <ArrowRight size={14} className="inline" />
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#90C2E7]/30 via-[#FEF7F8] to-white items-center justify-center px-12">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em] border border-[#CDD4DD]/60">
            Ce que vous obtenez
          </span>
          <h2 className="mt-6 text-3xl font-bold text-[#1F2937]">
            Tout pour <span className="text-[#22819A]">scaler votre prospection</span>.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Recherche illimitée d'entreprises B2B",
              "Emails personnalisés par Claude Sonnet 4.5",
              "Synchronisation CRM en 1 clic",
              "Workflows d'automatisation visuels",
              "Tableaux de bord en temps réel",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[#1F2937]">
                <CheckCircle2 size={20} className="text-[#22819A] shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
