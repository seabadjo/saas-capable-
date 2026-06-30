import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Megaphone, Mail, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { DASH } from "@/constants/testIds";

const STATUS_BADGE = {
  draft: "bg-[#CDD4DD]/60 text-[#1F2937]/70",
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-[#22819A] text-white",
};

export default function Campaigns() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const empty = { title: "", subject: "", channel: "email", status: "draft", steps: [] };
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/campaigns");
      setList(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/campaigns", form);
      toast.success("Campagne créée");
      setForm(empty);
      setOpen(false);
      load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette campagne ?")) return;
    try {
      await api.delete(`/campaigns/${id}`);
      setList((l) => l.filter((c) => c.id !== id));
      toast.success("Campagne supprimée");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Campagnes</h1>
          <p className="mt-1 text-sm text-[#1F2937]/65">Créez et pilotez vos séquences de prospection.</p>
        </div>
        <button
          data-testid={DASH.addCampaignBtn}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#22819A] text-white text-sm font-medium hover:bg-[#1a6b82] transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} strokeWidth={2} />
          Nouvelle campagne
        </button>
      </div>

      <div data-testid={DASH.campaignsTable} className="mt-8 grid gap-4">
        {loading ? (
          <div className="rounded-[20px] bg-white border border-[#CDD4DD] p-10 text-center text-sm text-[#1F2937]/60">
            Chargement…
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-[20px] bg-white border border-[#CDD4DD] p-12 text-center">
            <Megaphone size={32} className="mx-auto text-[#90C2E7]" strokeWidth={1.5} />
            <p className="mt-3 text-[#1F2937]/70 text-sm">Aucune campagne pour l'instant.</p>
          </div>
        ) : (
          list.map((c) => (
            <div key={c.id} className="rounded-[20px] bg-white border border-[#CDD4DD] p-5 hover:border-[#90C2E7] transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {c.channel === "linkedin" ? (
                      <Linkedin size={16} className="text-[#22819A]" strokeWidth={1.75} />
                    ) : (
                      <Mail size={16} className="text-[#22819A]" strokeWidth={1.75} />
                    )}
                    <h3 className="text-base font-semibold text-[#1F2937] truncate">{c.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[c.status] || ""}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#1F2937]/70 truncate">{c.subject}</p>
                  <div className="mt-3 flex items-center gap-5 text-xs text-[#1F2937]/65">
                    <span><strong className="text-[#1F2937]">{c.stats?.sent || 0}</strong> envoyés</span>
                    <span><strong className="text-[#1F2937]">{c.stats?.opened || 0}</strong> ouverts</span>
                    <span><strong className="text-[#1F2937]">{c.stats?.replied || 0}</strong> réponses</span>
                  </div>
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="p-2 rounded-[10px] text-[#1F2937]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="supprimer"
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2937]/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] bg-white border border-[#CDD4DD] shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#CDD4DD]">
              <h3 className="text-lg font-semibold text-[#1F2937]">Nouvelle campagne</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-[10px] hover:bg-[#FEF7F8]" aria-label="fermer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Titre *</label>
                <input
                  required
                  data-testid={DASH.campaignFormTitle}
                  value={form.title}
                  onChange={update("title")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Sujet email *</label>
                <input
                  required
                  data-testid={DASH.campaignFormSubject}
                  value={form.subject}
                  onChange={update("subject")}
                  className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Canal</label>
                  <select
                    value={form.channel}
                    onChange={update("channel")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  >
                    <option value="email">Email</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Statut</label>
                  <select
                    value={form.status}
                    onChange={update("status")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Active</option>
                    <option value="paused">En pause</option>
                    <option value="completed">Terminée</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-[14px] border border-[#CDD4DD] text-sm">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid={DASH.campaignFormSubmit}
                  className="px-5 py-2.5 rounded-[14px] bg-[#22819A] text-white text-sm font-medium hover:bg-[#1a6b82] disabled:opacity-60"
                >
                  {submitting ? "Création…" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
