import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Users } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { DASH } from "@/constants/testIds";

const STATUS_COLORS = {
  new: "bg-[#90C2E7]/30 text-[#22819A]",
  contacted: "bg-amber-100 text-amber-700",
  qualified: "bg-emerald-100 text-emerald-700",
  won: "bg-[#22819A] text-white",
  lost: "bg-red-100 text-red-700",
};

export default function Prospects() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const empty = { company: "", name: "", email: "", phone: "", industry: "", city: "", status: "new", score: 50 };
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/prospects");
      setList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: k === "score" ? Number(e.target.value) : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/prospects", form);
      toast.success("Prospect ajouté");
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
    if (!window.confirm("Supprimer ce prospect ?")) return;
    try {
      await api.delete(`/prospects/${id}`);
      setList((l) => l.filter((p) => p.id !== id));
      toast.success("Prospect supprimé");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Prospects</h1>
          <p className="mt-1 text-sm text-[#1F2937]/65">Gérez vos contacts B2B et leur statut.</p>
        </div>
        <button
          data-testid={DASH.addProspectBtn}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#22819A] text-white text-sm font-medium hover:bg-[#1a6b82] transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} strokeWidth={2} />
          Ajouter un prospect
        </button>
      </div>

      <div
        data-testid={DASH.prospectsTable}
        className="mt-8 rounded-[20px] bg-white border border-[#CDD4DD] overflow-hidden"
      >
        {loading ? (
          <div className="p-10 text-center text-sm text-[#1F2937]/60">Chargement…</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto text-[#90C2E7]" strokeWidth={1.5} />
            <p className="mt-3 text-[#1F2937]/70 text-sm">Aucun prospect pour l'instant.</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-[14px] bg-[#22819A] text-white text-sm hover:bg-[#1a6b82] transition-all"
            >
              <Plus size={14} /> Créer le premier
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#CDD4DD] text-xs uppercase tracking-wider text-[#1F2937]/60">
                  <th className="px-5 py-3">Entreprise</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Secteur</th>
                  <th className="px-5 py-3">Ville</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-[#CDD4DD]/50 hover:bg-[#FEF7F8] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#1F2937]">{p.company}</td>
                    <td className="px-5 py-3.5 text-[#1F2937]/80">{p.name || "—"}</td>
                    <td className="px-5 py-3.5 text-[#1F2937]/80">{p.email || "—"}</td>
                    <td className="px-5 py-3.5 text-[#1F2937]/80">{p.industry || "—"}</td>
                    <td className="px-5 py-3.5 text-[#1F2937]/80">{p.city || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-0.5 rounded-full bg-[#90C2E7]/20 text-[#22819A] text-xs font-semibold">
                        {p.score}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-700"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        data-testid={DASH.prospectDeleteBtn}
                        onClick={() => remove(p.id)}
                        className="p-2 rounded-[10px] text-[#1F2937]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="supprimer"
                      >
                        <Trash2 size={15} strokeWidth={1.75} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2937]/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] bg-white border border-[#CDD4DD] shadow-[0_30px_80px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#CDD4DD]">
              <h3 className="text-lg font-semibold text-[#1F2937]">Nouveau prospect</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-[10px] hover:bg-[#FEF7F8]" aria-label="fermer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Entreprise *</label>
                  <input
                    required
                    data-testid={DASH.prospectFormCompany}
                    value={form.company}
                    onChange={update("company")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Nom du contact</label>
                  <input
                    data-testid={DASH.prospectFormName}
                    value={form.name}
                    onChange={update("name")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Email</label>
                  <input
                    type="email"
                    data-testid={DASH.prospectFormEmail}
                    value={form.email}
                    onChange={update("email")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Secteur</label>
                  <input
                    data-testid={DASH.prospectFormIndustry}
                    value={form.industry}
                    onChange={update("industry")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Ville</label>
                  <input
                    data-testid={DASH.prospectFormCity}
                    value={form.city}
                    onChange={update("city")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Statut</label>
                  <select
                    value={form.status}
                    onChange={update("status")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  >
                    <option value="new">Nouveau</option>
                    <option value="contacted">Contacté</option>
                    <option value="qualified">Qualifié</option>
                    <option value="won">Gagné</option>
                    <option value="lost">Perdu</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22819A]">Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.score}
                    onChange={update("score")}
                    className="mt-1.5 w-full bg-white border border-[#CDD4DD] rounded-[14px] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#90C2E7]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-[14px] border border-[#CDD4DD] text-sm text-[#1F2937]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid={DASH.prospectFormSubmit}
                  className="px-5 py-2.5 rounded-[14px] bg-[#22819A] text-white text-sm font-medium hover:bg-[#1a6b82] disabled:opacity-60"
                >
                  {submitting ? "Création…" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
