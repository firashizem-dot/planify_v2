"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Mail, Building2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { adminApi } from "@/lib/api";
import { User, UserRole } from "@/types";

export default function DepartmentHeadsPage() {
  const [heads, setHeads] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", password: "", departmentId: "" });
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    adminApi.getDepartmentHeads()
      .then(r => setHeads(r.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = heads.filter(h =>
    `${h.firstName} ${h.lastName} ${h.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm({ email: "", firstName: "", lastName: "", password: "", departmentId: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (h: User) => {
    setEditTarget(h);
    setForm({ email: h.email, firstName: h.firstName, lastName: h.lastName, password: "", departmentId: String(h.departmentId || "") });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { ...form, role: "DEPARTMENT_HEAD" as UserRole, departmentId: form.departmentId ? Number(form.departmentId) : undefined };
      if (editTarget) {
        await adminApi.updateDepartmentHead(editTarget.id, payload);
      } else {
        await adminApi.createDepartmentHead(payload);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce chef de département?")) return;
    await adminApi.deleteDepartmentHead(id);
    load();
  };

  return (
    <div className="animate-fade-in">
      <Header title="Chefs de Département" subtitle="Gérer les comptes des chefs de département" />

      <div className="p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>

        {/* Table */}
        <div className="planify-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Nom", "Email", "Département", "2FA", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun résultat</td></tr>
              ) : filtered.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{h.firstName} {h.lastName}</td>
                  <td className="px-4 py-3 text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />{h.email}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {h.departmentName ? <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{h.departmentName}</span> : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.twoFactorEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {h.twoFactorEnabled ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(h)} className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(h.id)} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editTarget ? "Modifier" : "Nouveau chef de département"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              {[
                { label: "Prénom", key: "firstName" },
                { label: "Nom", key: "lastName" },
                { label: "Email", key: "email", type: "email" },
                { label: "Mot de passe", key: "password", type: "password", required: !editTarget },
                { label: "ID Département (optionnel)", key: "departmentId" },
              ].map(({ label, key, type = "text", required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && " *"}</label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50" />
                </div>
              ))}
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
