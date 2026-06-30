import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { AUTH } from "@/constants/testIds";
import { ArrowRight, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <h1 className="mt-10 text-3xl font-bold tracking-tight text-[#1F2937]">
            Bon retour !
          </h1>
          <p className="mt-2 text-sm text-[#1F2937]/70">
            Connectez-vous pour piloter votre prospection.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid={AUTH.loginEmail}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
                placeholder="vous@entreprise.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Mot de passe</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid={AUTH.loginPassword}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent"
                placeholder="••••••••"
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
              data-testid={AUTH.loginSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] bg-[#22819A] text-white font-medium hover:bg-[#1a6b82] disabled:opacity-60 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(34,129,154,0.3)] hover:-translate-y-0.5"
            >
              <LogIn size={18} strokeWidth={1.75} />
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#1F2937]/70">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold text-[#22819A] hover:underline">
              Créer un compte <ArrowRight size={14} className="inline" />
            </Link>
          </p>
        </div>
      </div>

      {/* Right visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#90C2E7]/30 via-[#FEF7F8] to-white items-center justify-center px-12">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative max-w-md text-center">
          <div className="mx-auto h-20 w-20 rounded-[24px] bg-[#22819A] text-white flex items-center justify-center shadow-[0_20px_50px_rgba(34,129,154,0.35)]">
            <LogIn size={32} strokeWidth={1.5} />
          </div>
          <h2 className="mt-8 text-3xl font-bold text-[#1F2937]">
            Votre pipeline, <span className="text-[#22819A]">automatisé</span>.
          </h2>
          <p className="mt-3 text-[#1F2937]/70">
            Rejoignez les équipes qui ferment plus de deals avec moins d'effort grâce à GUEGON.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { v: "+312%", l: "leads qualifiés" },
              { v: "42%", l: "taux d'ouverture" },
              { v: "8h", l: "économisées/sem" },
            ].map((s, i) => (
              <div key={i} className="rounded-[16px] bg-white border border-[#CDD4DD]/60 p-4">
                <div className="text-lg font-bold text-[#22819A]">{s.v}</div>
                <div className="text-xs text-[#1F2937]/65 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
