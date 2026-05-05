"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, BookOpen, Settings2, X, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import { professorApi, subjectApi, timeslotApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Professor, ProfessorPreference, Subject, TimeSlot, DAY_LABELS, DayOfWeek } from "@/types";
import { formatTime } from "@/lib/utils";

const emptyForm = {
  firstName: "", lastName: "", email: "", password: "",
  specialization: "", maxHoursPerWeek: "18", subjectIds: [] as number[],
};

export default function ProfessorsPage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timeslots, setTimeslots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Professor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const [prefProfessor, setPrefProfessor] = useState<Professor | null>(null);
  const [preferences, setPreferences] = useState<ProfessorPreference[]>([]);
  const [prefLoading, setPrefLoading] = useState(false);

  const load = () => {
    setIsLoading(true);
    Promise.all([
      professorApi.getAll(deptId),
      subjectApi.getAll(deptId),
      deptId ? timeslotApi.getByDepartment(deptId) : Promise.resolve({ data: [] }),
    ])
      .then(([p, s, t]) => { setProfessors(p.data); setSubjects(s.data); setTimeslots(t.data); })
      .catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const filtered = professors.filter(p =>
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (p: Professor) => {
    setEditTarget(p);
    setForm({
      firstName: p.firstName, lastName: p.lastName, email: p.email,
      password: "",
      specialization: p.specialization || "",
      maxHoursPerWeek: String(p.maxHoursPerWeek),
      subjectIds: p.subjectIds ? [...p.subjectIds] : [],
    });
    setError("");
    setShowModal(true);
  };

  const toggleSubject = (id: number) => {
    setForm(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id)
        ? prev.subjectIds.filter(s => s !== id)
        : [...prev.subjectIds, id],
    }));
  };

  const handleSave = async () => {
    setError("");
    try {
      if (editTarget) {
        const payload = {
          departmentId: deptId,
          specialization: form.specialization,
          maxHoursPerWeek: Number(form.maxHoursPerWeek),
          subjectIds: form.subjectIds,
        };
        await professorApi.update(editTarget.id, payload);
      } else {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          departmentId: deptId,
          specialization: form.specialization,
          maxHoursPerWeek: Number(form.maxHoursPerWeek),
          subjectIds: form.subjectIds,
        };
        await professorApi.create(payload);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce professeur ?")) return;
    await professorApi.delete(id);
    load();
  };

  const openPreferences = async (p: Professor) => {
    setPrefProfessor(p);
    setPrefLoading(true);
    try {
      const r = await professorApi.getPreferences(p.id);
      setPreferences(r.data);
    } finally {
      setPrefLoading(false);
    }
  };

  const togglePreference = async (timeSlotId: number) => {
    if (!prefProfessor) return;
    const exists = preferences.some(pref => pref.timeSlotId === timeSlotId);
    if (exists) {
      await professorApi.removePreference(prefProfessor.id, timeSlotId);
      setPreferences(prev => prev.filter(p => p.timeSlotId !== timeSlotId));
    } else {
      const r = await professorApi.addPreference(prefProfessor.id, timeSlotId);
      setPreferences(prev => [...prev, r.data]);
    }
  };

  const slotsByDay = timeslots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {});

  const dayOrder: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

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
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
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
                      {(p.subjectNames?.length || 0) > 2 && (
                        <span className="text-xs text-gray-400">+{(p.subjectNames?.length || 0) - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openPreferences(p)} title="Préférences horaires"
                        className="p-1.5 hover:bg-amber-50 text-gray-400 hover:text-amber-600 rounded-lg transition-colors">
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
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

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editTarget ? "Modifier le professeur" : "Nouveau professeur"}
              </h3>
              {editTarget && (
                <p className="text-sm text-gray-500 mt-0.5">{editTarget.firstName} {editTarget.lastName}</p>
              )}
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              {/* User info — only on create */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
                <input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max heures/semaine</label>
                <input type="number" value={form.maxHoursPerWeek}
                  onChange={e => setForm(p => ({ ...p, maxHoursPerWeek: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Matières enseignées
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2">
                  {subjects.map(s => (
                    <label key={s.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={form.subjectIds.includes(s.id)}
                        onChange={() => toggleSubject(s.id)}
                        className="rounded text-primary-500 focus:ring-primary-500" />
                      <span className="text-sm text-gray-700">{s.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">{s.courseType}</span>
                    </label>
                  ))}
                </div>
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

      {/* Preferences modal */}
      {prefProfessor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Préférences horaires</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {prefProfessor.firstName} {prefProfessor.lastName} — cochez les créneaux à éviter
                </p>
              </div>
              <button onClick={() => setPrefProfessor(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {prefLoading ? (
                <div className="text-center text-gray-400 py-8">Chargement...</div>
              ) : timeslots.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Aucun créneau horaire défini pour ce département</p>
                </div>
              ) : (
                dayOrder.filter(day => slotsByDay[day]?.length > 0).map(day => (
                  <div key={day}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{DAY_LABELS[day]}</h4>
                    <div className="space-y-1">
                      {slotsByDay[day].map(slot => {
                        const isAvoided = preferences.some(p => p.timeSlotId === slot.id);
                        return (
                          <label key={slot.id}
                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors border ${
                              isAvoided
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                            }`}>
                            <input type="checkbox" checked={isAvoided}
                              onChange={() => togglePreference(slot.id)}
                              className="rounded text-red-500 focus:ring-red-400" />
                            <span className="text-sm font-medium">
                              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                            </span>
                            {isAvoided && (
                              <span className="ml-auto text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                À éviter
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 pt-0 flex justify-end">
              <button onClick={() => setPrefProfessor(null)}
                className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
