"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { groupApi, scheduleApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { ScheduleSession, StudentGroup } from "@/types";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (deptId) groupApi.getAll(deptId).then(r => setGroups(r.data)).catch(console.error);
  }, [deptId]);

  const loadGroupSchedule = async (groupId: number) => {
    setSelectedGroup(groupId);
    setIsLoading(true);
    scheduleApi.byGroup(groupId)
      .then(r => setSessions(r.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="animate-fade-in">
      <Header title="Emploi du Temps" subtitle="Consultez l'emploi du temps de votre groupe" />
      <div className="p-6 space-y-5">
        {/* Group selector */}
        <div className="planify-card">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez votre groupe</label>
          <div className="flex flex-wrap gap-2">
            {groups.map(g => (
              <button key={g.id} onClick={() => loadGroupSchedule(g.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedGroup === g.id
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                }`}>
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {selectedGroup && (
          <div className="planify-card animate-fade-in">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                  Emploi du temps — {groups.find(g => g.id === selectedGroup)?.name}
                </h2>
                <TimetableGrid sessions={sessions} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
