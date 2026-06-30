import React, { useState } from "react";
import { Wand2, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { DASH } from "@/constants/testIds";

export default function AIEmail() {
  const empty = {
    prospect_name: "",
    company: "",
    industry: "",
    role: "",
    context: "",
    tone: "professionnel",
    goal: "obtenir un rendez-vous",
  };
  const [form, setForm] = useState(empty);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/ai/generate-email", form);
      setResult(data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Erreur IA");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    const text = `Sujet: ${result.subject}\n\n${result.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em]">
          <Sparkles size={12} strokeWidth={1.75} /> Claude Sonnet 4.5
        </span>
        <h1 className="mt-3 text-3xl font-bold text-[#1F2937]">Générateur d'emails IA</h1>
        <p className="mt-1 text-sm text-[#1F2937]/65">
          Décrivez votre prospect, l'IA rédige un email personnalisé en quelques secondes.
        </p>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={submit}
          className="rounded-[24px] bg-white border border-[#CDD4DD] p-6"
        >
          <h2 className="text-base font-semibold text-[#1F2937]">Contexte du prospect</h2>
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Entreprise *</label>
                <input
                  required
                  data-testid={DASH.aiEmailCompany}
                  value={form.company}
                  onChange={update("company")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Contact</label>
                <input
                  data-testid={DASH.aiEmailName}
                  value={form.prospect_name}
                  onChange={update("prospect_name")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Rôle</label>
                <input
                  data-testid={DASH.aiEmailRole}
                  value={form.role}
                  onChange={update("role")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  placeholder="CMO, CTO…"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Secteur</label>
                <input
                  data-testid={DASH.aiEmailIndustry}
                  value={form.industry}
                  onChange={update("industry")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  placeholder="SaaS, Immobilier…"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Contexte / accroche</label>
              <textarea
                rows={3}
                data-testid={DASH.aiEmailContext}
                value={form.context}
                onChange={update("context")}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7] resize-none"
                placeholder="Ex : ils viennent de lever 2M€…"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Ton</label>
                <select
                  data-testid={DASH.aiEmailTone}
                  value={form.tone}
                  onChange={update("tone")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                >
                  <option value="professionnel">Professionnel</option>
                  <option value="amical">Amical</option>
                  <option value="direct">Direct</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Objectif</label>
                <input
                  value={form.goal}
                  onChange={update("goal")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid={DASH.aiEmailGenerateBtn}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[16px] bg-[#22819A] text-white font-medium hover:bg-[#1a6b82] disabled:opacity-60 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(34,129,154,0.3)]"
            >
              <Wand2 size={18} strokeWidth={1.75} />
              {loading ? "Génération en cours…" : "Générer l'email"}
            </button>
          </div>
        </form>

        <div
          data-testid={DASH.aiEmailResult}
          className="rounded-[24px] bg-white border border-[#CDD4DD] p-6 min-h-[320px]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1F2937]">Email généré</h2>
            {result && (
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#CDD4DD] text-xs font-medium hover:border-[#22819A] transition-colors"
              >
                {copied ? <Check size={14} className="text-[#22819A]" /> : <Copy size={14} />}
                {copied ? "Copié" : "Copier"}
              </button>
            )}
          </div>
          {!result && !loading && (
            <div className="mt-16 text-center text-sm text-[#1F2937]/55">
              <Wand2 size={28} className="mx-auto text-[#90C2E7]" strokeWidth={1.5} />
              <p className="mt-3">Remplissez le formulaire puis cliquez sur Générer.</p>
            </div>
          )}
          {loading && (
            <div className="mt-16 text-center text-sm text-[#22819A]">
              <div className="mx-auto h-3 w-3 rounded-full bg-[#22819A] pulse-ring" />
              <p className="mt-4">L'IA rédige votre email…</p>
            </div>
          )}
          {result && (
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Sujet</div>
                <div className="mt-1 text-[#1F2937] font-medium">{result.subject || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Corps</div>
                <pre className="mt-1.5 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1F2937]/90 bg-[#FEF7F8] border border-[#CDD4DD]/60 rounded-[16px] p-4">
                  {result.body || result.raw}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
