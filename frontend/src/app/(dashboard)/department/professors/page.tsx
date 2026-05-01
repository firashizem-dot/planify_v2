"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import { professorApi, subjectApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Professor, Subject } from "@/types";

export default function ProfessorsPage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Professor | null>(null);
  const [form, setForm] = useState({ userId: "", specialization: "", maxHoursPerWeek: "18", subjectIds: [] as number[] });
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    Promise.all([professorApi.getAll(deptId), subjectApi.getAll(deptId)])
      .then(([p, s]) => { setProfessors(p.data); setSubjects(s.data); })
      .catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const filtered = professors.filter(p =>
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ userId: "", specialization: "", maxHoursPerWeek: "18", subjectIds: [] });
    setError("");
    setShowModal(true);
  };

  const openEdit = (p: Professor) => {
    setEditTarget(p);
    setForm({ userId: String(p.userId), specialization: p.specialization || "", maxHoursPerWeek: String(p.maxHoursPerWeek), subjectIds: p.subjectIds || [] });
    setError("");
    setShowModal(true);
  };

  const toggleSubject = (id: number) => {
    setForm(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id) ? prev.subjectIds.filter(s => s !== id) : [...prev.subjectIds, id]
    }));
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { userId: Number(form.userId), departmentId: deptId, specialization: form.specialization, maxHoursPerWeek: Number(form.maxHoursPerWeek), subjectIds: form.subjectIds };
      if (editTarget) await professorApi.update(editTarget.id, payload);
      else await professorApi.create(payload);
      setShowModal(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce professeur?")) return;
    await professorApi.delete(id);
    load();
  };

  return (
    <div className="animate-fade-in">
      <Header title="Professeurs" subtitle="Gestion des professeurs du département" />
      <div className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>

        <div className="planify-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Nom", "Email", "Spécialisation", "H/sem.", "Matières", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun professeur</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.firstName} {p.lastName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.email}</td>
                  <td className="px-4 py-3 text-gray-500">{p.specialization || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{p.maxHoursPerWeek}h</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.subjectNames?.slice(0, 2).map(s => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{s}</span>
                      ))}
                      {(p.subjectNames?.length || 0) > 2 && <span className="text-xs text-gray-400">+{(p.subjectNames?.length || 0) - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{editTarget ? "Modifier" : "Nouveau professeur"}</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              {!editTarget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID *</label>
                  <input value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
                <input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max heures/semaine</label>
                <input type="number" value={form.maxHoursPerWeek} onChange={e => setForm(p => ({ ...p, maxHoursPerWeek: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Matières enseignées
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2">
                  {subjects.map(s => (
                    <label key={s.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={form.subjectIds.includes(s.id)} onChange={() => toggleSubject(s.id)}
                        className="rounded text-primary-500 focus:ring-primary-500" />
                      <span className="text-sm text-gray-700">{s.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">{s.courseType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
