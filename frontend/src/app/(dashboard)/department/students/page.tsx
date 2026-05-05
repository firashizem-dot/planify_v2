"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import { studentApi, groupApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Student, StudentGroup } from "@/types";

const emptyForm = {
  firstName: "", lastName: "", email: "", password: "",
  studentGroupId: "",
};

export default function StudentsPage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;

  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    Promise.all([
      studentApi.getAll(),
      groupApi.getAll(deptId),
    ])
      .then(([s, g]) => { setStudents(s.data); setGroups(g.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const filtered = students.filter(s => {
    const matchSearch = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase());
    const matchGroup = !filterGroup || String(s.studentGroupId) === filterGroup;
    return matchSearch && matchGroup;
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, studentGroupId: groups[0] ? String(groups[0].id) : "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (s: Student) => {
    setEditTarget(s);
    setForm({
      firstName: s.firstName, lastName: s.lastName,
      email: s.email, password: "",
      studentGroupId: String(s.studentGroupId),
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      if (editTarget) {
        await studentApi.update(editTarget.id, {
          studentGroupId: Number(form.studentGroupId),
        });
      } else {
        await studentApi.create({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          studentGroupId: Number(form.studentGroupId),
        });
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet étudiant ?")) return;
    await studentApi.delete(id);
    load();
  };

  return (
    <div className="animate-fade-in">
      <Header title="Étudiants" subtitle="Gestion des étudiants et affectation aux groupes" />
      <div className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Tous les groupes</option>
              {groups.map(g => (
                <option key={g.id} value={String(g.id)}>{g.name}</option>
              ))}
            </select>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>

        <div className="planify-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Nom", "Email", "Groupe", "Niveau", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun étudiant</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                      {s.studentGroupName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.groupLevel || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)}
                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(s.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
              <h3 className="text-lg font-semibold text-gray-900">
                {editTarget ? "Modifier l'étudiant" : "Nouvel étudiant"}
              </h3>
              {editTarget && (
                <p className="text-sm text-gray-500 mt-0.5">{editTarget.firstName} {editTarget.lastName}</p>
              )}
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              {!editTarget && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                    <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="border-t border-gray-100 pt-1" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Groupe *</label>
                <select value={form.studentGroupId} onChange={e => setForm(p => ({ ...p, studentGroupId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">— Sélectionner un groupe —</option>
                  {groups.map(g => (
                    <option key={g.id} value={String(g.id)}>
                      {g.name} {g.level ? `(${g.level})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
