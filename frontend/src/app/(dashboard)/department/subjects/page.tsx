"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import { subjectApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Subject, CourseType, COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from "@/types";

export default function SubjectsPage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Subject | null>(null);
  const [form, setForm] = useState({ name: "", code: "", courseType: "CI" as CourseType, hoursPerWeek: "1.5", level: "", description: "" });
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    subjectApi.getAll(deptId).then(r => setSubjects(r.data)).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const filtered = subjects.filter(s =>
    `${s.name} ${s.code} ${s.level}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: "", code: "", courseType: "CI", hoursPerWeek: "1.5", level: "", description: "" });
    setError(""); setShowModal(true);
  };

  const openEdit = (s: Subject) => {
    setEditTarget(s);
    setForm({ name: s.name, code: s.code, courseType: s.courseType, hoursPerWeek: String(s.hoursPerWeek), level: s.level || "", description: s.description || "" });
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { ...form, departmentId: deptId, hoursPerWeek: Number(form.hoursPerWeek) };
      if (editTarget) await subjectApi.update(editTarget.id, payload);
      else await subjectApi.create(payload);
      setShowModal(false); load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="Matières" subtitle="Gestion des matières et cours" />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3 justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>

        <div className="planify-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Code", "Nom", "Type", "H/sem.", "Niveau", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucune matière</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 font-medium">{s.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COURSE_TYPE_COLORS[s.courseType]}`}>
                      {COURSE_TYPE_LABELS[s.courseType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.hoursPerWeek}h</td>
                  <td className="px-4 py-3 text-gray-500">{s.level || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => { if (confirm("Supprimer?")) { await subjectApi.delete(s.id); load(); } }}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">{editTarget ? "Modifier la matière" : "Nouvelle matière"}</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              {[
                { label: "Nom *", key: "name" },
                { label: "Code *", key: "code" },
                { label: "Volume horaire (h/sem.) *", key: "hoursPerWeek", type: "number" },
                { label: "Niveau (ex: L2)", key: "level" },
                { label: "Description", key: "description" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de cours *</label>
                <select value={form.courseType} onChange={e => setForm(p => ({ ...p, courseType: e.target.value as CourseType }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {(["CI", "TD", "TP"] as CourseType[]).map(t => (
                    <option key={t} value={t}>{COURSE_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
