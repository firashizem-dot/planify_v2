"use client";
import { useEffect, useState } from "react";
import { Sparkles, CheckCircle, Globe, Archive, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { scheduleApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Schedule, ScheduleSession, ScheduleStatus } from "@/types";
import { formatDuration } from "@/lib/utils";

const STATUS_COLORS: Record<ScheduleStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  GENERATED: "bg-yellow-100 text-yellow-700",
  VALIDATED: "bg-blue-100 text-blue-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function TimetablePage() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState("");
  const [genForm, setGenForm] = useState({ semester: "S1", academicYear: "2025-2026", solveSeconds: 30 });

  const load = () => {
    if (!deptId) return;
    setIsLoading(true);
    scheduleApi.getAll(deptId).then(r => setSchedules(r.data)).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [deptId]);

  const loadSessions = async (schedule: Schedule) => {
    setSelected(schedule);
    const r = await scheduleApi.getSessions(schedule.id);
    setSessions(r.data);
  };

  const handleGenerate = async () => {
    if (!deptId) return;
    setError("");
    setIsSolving(true);
    try {
      await scheduleApi.generate({ departmentId: deptId, ...genForm });
      setIsGenerating(false);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Erreur lors de la génération");
    } finally {
      setIsSolving(false);
    }
  };

  const handleAction = async (action: "validate" | "publish" | "archive", id: number) => {
    const fn = action === "validate" ? scheduleApi.validate :
               action === "publish"  ? scheduleApi.publish  : scheduleApi.archive;
    await fn(id);
    load();
    if (selected?.id === id) {
      const r = await scheduleApi.getAll(deptId!);
      const updated = r.data.find((s: Schedule) => s.id === id);
      if (updated) setSelected(updated);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="Emplois du temps" subtitle="Génération et gestion des emplois du temps" />

      <div className="p-6 space-y-5">
        {/* Generate button */}
        <div className="planify-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Générer un emploi du temps</h2>
              <p className="text-sm text-gray-500 mt-0.5">OptaPlanner générera un emploi du temps optimisé en respectant toutes les contraintes</p>
            </div>
            <button onClick={() => setIsGenerating(!isGenerating)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <Sparkles className="w-4 h-4" /> Nouvelle génération
            </button>
          </div>

          {isGenerating && (
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                  <select value={genForm.semester} onChange={e => setGenForm(p => ({ ...p, semester: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {["S1", "S2", "S3", "S4", "S5", "S6"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année académique</label>
                  <input value={genForm.academicYear} onChange={e => setGenForm(p => ({ ...p, academicYear: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée de résolution (sec)</label>
                  <input type="number" min={10} max={300} value={genForm.solveSeconds}
                    onChange={e => setGenForm(p => ({ ...p, solveSeconds: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <button onClick={handleGenerate} disabled={isSolving}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                {isSolving ? <><Loader2 className="w-4 h-4 animate-spin" />Résolution OptaPlanner...</> : <><Sparkles className="w-4 h-4" />Lancer la génération</>}
              </button>
              {isSolving && <p className="text-xs text-gray-500 mt-2">OptaPlanner est en train d'optimiser votre emploi du temps. Cela peut prendre jusqu'à {genForm.solveSeconds} secondes.</p>}
            </div>
          )}
        </div>

        {/* Schedules list */}
        <div className="planify-card p-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Emplois du temps générés</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Chargement...</div>
          ) : schedules.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <CalendarEmpty />
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {schedules.map(s => (
                <div key={s.id} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selected?.id === s.id ? "bg-primary-50" : ""}`}
                  onClick={() => loadSessions(s)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">{s.semester} — {s.academicYear}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                        <span className="text-xs text-gray-400">
                          Score: {s.hardScore}H / {s.softScore}S
                        </span>
                        {s.solveDurationMs && <span className="text-xs text-gray-400">({formatDuration(s.solveDurationMs)})</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.status === "GENERATED" && (
                        <button onClick={e => { e.stopPropagation(); handleAction("validate", s.id); }}
                          className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />Valider
                        </button>
                      )}
                      {s.status === "VALIDATED" && (
                        <button onClick={e => { e.stopPropagation(); handleAction("publish", s.id); }}
                          className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                          <Globe className="w-3.5 h-3.5" />Publier
                        </button>
                      )}
                      {(s.status === "PUBLISHED" || s.status === "VALIDATED") && (
                        <button onClick={e => { e.stopPropagation(); handleAction("archive", s.id); }}
                          className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                          <Archive className="w-3.5 h-3.5" />Archiver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected timetable grid */}
        {selected && (
          <div className="planify-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                Visualisation — {selected.semester} {selected.academicYear}
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                {selected.status}
              </span>
            </div>
            <TimetableGrid sessions={sessions} />
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarEmpty() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
        <span className="text-3xl">📅</span>
      </div>
      <p className="font-medium text-gray-600">Aucun emploi du temps</p>
      <p className="text-sm mt-1 text-gray-400">Cliquez sur "Nouvelle génération" pour commencer</p>
    </div>
  );
}
