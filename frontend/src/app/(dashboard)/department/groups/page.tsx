"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import { groupApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { StudentGroup } from "@/types";

export default function GroupsPage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<StudentGroup | null>(null);
  const [form, setForm] = useState({ name: "", code: "", level: "", studentCount: "25" });
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    groupApi.getAll(deptId).then(r => setGroups(r.data)).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const filtered = groups.filter(g => `${g.name} ${g.code} ${g.level}`.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: "", code: "", level: "", studentCount: "25" });
    setError(""); setShowModal(true);
  };

  const openEdit = (g: StudentGroup) => {
    setEditTarget(g);
    setForm({ name: g.name, code: g.code, level: g.level || "", studentCount: String(g.studentCount) });
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { ...form, departmentId: deptId, studentCount: Number(form.studentCount) };
      if (editTarget) await groupApi.update(editTarget.id, payload);
      else await groupApi.create(payload);
      setShowModal(false); load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="Groupes d'étudiants" subtitle="Gestion des groupes et classes" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? [...Array(4)].map((_, i) => (
            <div key={i} className="planify-card h-24 animate-pulse bg-gray-50" />
          )) : filtered.map(g => (
            <div key={g.id} className="planify-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{g.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono">{g.code}</span>
                    {g.level && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{g.level}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />{g.studentCount} étudiants
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(g)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={async () => { if (confirm("Supprimer?")) { await groupApi.delete(g.id); load(); } }}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">{editTarget ? "Modifier le groupe" : "Nouveau groupe"}</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              {[
                { label: "Nom *", key: "name" },
                { label: "Code *", key: "code" },
                { label: "Niveau (ex: L2)", key: "level" },
                { label: "Nombre d'étudiants", key: "studentCount", type: "number" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              ))}
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
