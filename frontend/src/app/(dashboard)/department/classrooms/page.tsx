"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import { classroomApi } from "@/lib/api";
import { Classroom, ClassroomType, CLASSROOM_TYPE_LABELS } from "@/types";

const TYPE_COLORS: Record<ClassroomType, string> = {
  AMPHITHEATER: "bg-orange-100 text-orange-700",
  TD_ROOM:      "bg-blue-100 text-blue-700",
  LABORATORY:   "bg-violet-100 text-violet-700",
};

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Classroom | null>(null);
  const [form, setForm] = useState({ name: "", code: "", type: "TD_ROOM" as ClassroomType, capacity: "30", equipment: "" });
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    classroomApi.getAll().then(r => setClassrooms(r.data)).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = classrooms.filter(c =>
    `${c.name} ${c.code} ${c.type}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: "", code: "", type: "TD_ROOM", capacity: "30", equipment: "" });
    setError(""); setShowModal(true);
  };

  const openEdit = (c: Classroom) => {
    setEditTarget(c);
    setForm({ name: c.name, code: c.code, type: c.type, capacity: String(c.capacity), equipment: c.equipment || "" });
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editTarget) await classroomApi.update(editTarget.id, payload);
      else await classroomApi.create(payload);
      setShowModal(false); load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="Salles & Laboratoires" subtitle="Gestion des salles de cours et laboratoires" />
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
          {isLoading ? [...Array(6)].map((_, i) => (
            <div key={i} className="planify-card h-32 animate-pulse bg-gray-50" />
          )) : filtered.map(c => (
            <div key={c.id} className="planify-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <span className="font-mono text-xs text-gray-500">{c.code}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={async () => { if (confirm("Supprimer?")) { await classroomApi.delete(c.id); load(); } }}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[c.type]}`}>
                  {CLASSROOM_TYPE_LABELS[c.type]}
                </span>
                <span className="text-xs text-gray-500">{c.capacity} places</span>
              </div>
              {c.equipment && <p className="text-xs text-gray-400 mt-2 truncate">{c.equipment}</p>}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">{editTarget ? "Modifier la salle" : "Nouvelle salle"}</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              {[
                { label: "Nom *", key: "name" },
                { label: "Code *", key: "code" },
                { label: "Capacité (places) *", key: "capacity", type: "number" },
                { label: "Équipements", key: "equipment" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as ClassroomType }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {(Object.keys(CLASSROOM_TYPE_LABELS) as ClassroomType[]).map(t => (
                    <option key={t} value={t}>{CLASSROOM_TYPE_LABELS[t]}</option>
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
