"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { scheduleApi } from "@/lib/api";
import { ScheduleSession } from "@/types";

export default function ProfessorDashboard() {
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    scheduleApi.mySchedule()
      .then(r => setSessions(r.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <Header title="Mon Emploi du Temps" subtitle="Vos séances de cours planifiées" />
      <div className="p-6">
        {isLoading ? (
          <div className="planify-card flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="planify-card">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Vue hebdomadaire</h2>
            <TimetableGrid sessions={sessions} />
          </div>
        )}
      </div>
    </div>
  );
}
