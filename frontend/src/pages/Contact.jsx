import React, { useState } from "react";
import { toast } from "sonner";
import { Send, Mail as MailIcon, MapPin, MessageCircle } from "lucide-react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { LANDING } from "@/constants/testIds";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message envoyé ! Nous vous recontactons sous 24h.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Échec de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold uppercase tracking-[0.18em]">
            Contact
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2937]">
            Parlons de votre <span className="text-[#22819A]">prospection</span>.
          </h1>
          <p className="mt-4 text-[#1F2937]/70 max-w-md">
            Une question, une démo, un projet d'envergure ? Écrivez-nous, nous
            répondons en moins de 24h ouvrées.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: MailIcon, label: "Email", value: "hello@guegon.io" },
              { icon: MessageCircle, label: "Support", value: "support@guegon.io" },
              { icon: MapPin, label: "Adresse", value: "Paris · Lyon · Remote" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="h-11 w-11 rounded-[14px] bg-gradient-to-br from-[#90C2E7]/40 to-[#22819A]/15 text-[#22819A] inline-flex items-center justify-center">
                  <c.icon size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1F2937]/60">{c.label}</div>
                  <div className="text-sm text-[#1F2937]">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[24px] bg-white border border-[#CDD4DD] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
        >
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Nom</label>
              <input
                required
                data-testid={LANDING.contactName}
                value={form.name}
                onChange={update("name")}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent transition-all"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Email</label>
              <input
                required
                type="email"
                data-testid={LANDING.contactEmail}
                value={form.email}
                onChange={update("email")}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent transition-all"
                placeholder="jean@entreprise.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Entreprise</label>
              <input
                data-testid={LANDING.contactCompany}
                value={form.company}
                onChange={update("company")}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent transition-all"
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Message</label>
              <textarea
                required
                rows={5}
                data-testid={LANDING.contactMessage}
                value={form.message}
                onChange={update("message")}
                className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[16px] px-4 py-3 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#90C2E7] focus:border-transparent transition-all resize-none"
                placeholder="Dites-nous tout…"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid={LANDING.contactSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[20px] bg-[#22819A] text-white font-medium hover:bg-[#1a6b82] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_12px_30px_rgba(34,129,154,0.35)] hover:-translate-y-0.5"
            >
              <Send size={18} strokeWidth={1.75} />
              {loading ? "Envoi…" : "Envoyer le message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
