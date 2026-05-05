"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { timeslotApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { TimeSlot, DayOfWeek, DAY_LABELS, DAYS_ORDER } from "@/types";
import { formatTime } from "@/lib/utils";

export default function TimeSlotsPage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId!;
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ dayOfWeek: "MONDAY" as DayOfWeek, startTime: "08:00", endTime: "09:30" });
  const [error, setError] = useState("");

  const load = () => {
    setIsLoading(true);
    timeslotApi.getByDepartment(deptId).then(r => setSlots(r.data)).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const grouped = DAYS_ORDER.reduce((acc, day) => {
    acc[day] = slots.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<DayOfWeek, TimeSlot[]>);

  const handleSave = async () => {
    setError("");
    try {
      await timeslotApi.create({ ...form, startTime: `${form.startTime}:00`, endTime: `${form.endTime}:00`, departmentId: deptId });
      setShowModal(false); load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="Créneaux horaires" subtitle="Définir les plages horaires de travail" />
      <div className="p-6 space-y-5">
        <div className="flex justify-end">
          <button onClick={() => { setShowModal(true); setError(""); }}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Ajouter un créneau
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {DAYS_ORDER.map(day => (
            <div key={day} className="planify-card">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm text-center">{DAY_LABELS[day]}</h3>
              <div className="space-y-1.5">
                {isLoading ? [...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                )) : grouped[day].length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">Aucun créneau</p>
                ) : grouped[day].map(slot => (
                  <div key={slot.id} className="flex items-center justify-between bg-primary-50 text-primary-700 rounded-lg px-3 py-1.5 text-xs font-medium">
                    <span>{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                    <button onClick={async () => { await timeslotApi.delete(slot.id); load(); }}
                      className="text-primary-400 hover:text-red-500 ml-2 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Nouveau créneau</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                <select value={form.dayOfWeek} onChange={e => setForm(p => ({ ...p, dayOfWeek: e.target.value as DayOfWeek }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {DAYS_ORDER.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                  <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                  <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
