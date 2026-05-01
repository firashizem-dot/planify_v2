"use client";
import { ScheduleSession, DayOfWeek, CourseType, DAYS_ORDER, DAY_LABELS, COURSE_TYPE_COLORS, COURSE_TYPE_LABELS } from "@/types";
import { formatTime } from "@/lib/utils";
import { useState } from "react";

interface Props {
  sessions: ScheduleSession[];
  showGroupFilter?: boolean;
}

export default function TimetableGrid({ sessions }: Props) {
  const [selected, setSelected] = useState<ScheduleSession | null>(null);

  // Collect unique time labels
  const timesSet = new Set<string>();
  sessions.forEach(s => timesSet.add(`${s.startTime}|${s.endTime}`));
  const times = Array.from(timesSet).sort();

  // Build lookup map
  const map = new Map<string, ScheduleSession[]>();
  sessions.forEach(s => {
    const key = `${s.dayOfWeek}|${s.startTime}|${s.endTime}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  });

  const activeDays = DAYS_ORDER.filter(d => sessions.some(s => s.dayOfWeek === d));

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <p className="font-medium">Aucune séance planifiée</p>
        <p className="text-sm mt-1">Générez un emploi du temps pour voir les créneaux</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header row */}
        <div className="grid gap-px bg-gray-200 rounded-t-xl overflow-hidden"
          style={{ gridTemplateColumns: `100px repeat(${activeDays.length}, 1fr)` }}>
          <div className="bg-gray-50 py-3 text-xs font-semibold text-gray-500 text-center">Horaire</div>
          {activeDays.map(d => (
            <div key={d} className="bg-primary-50 py-3 text-center text-sm font-semibold text-primary-700">
              {DAY_LABELS[d]}
            </div>
          ))}
        </div>

        {/* Time rows */}
        <div className="bg-gray-200 rounded-b-xl overflow-hidden" style={{ display: "grid", gap: "1px" }}>
          {times.map(timeKey => {
            const [start, end] = timeKey.split("|");
            return (
              <div key={timeKey} className="grid gap-px"
                style={{ gridTemplateColumns: `100px repeat(${activeDays.length}, 1fr)` }}>
                {/* Time label */}
                <div className="bg-gray-50 flex flex-col items-center justify-center py-3 px-2">
                  <span className="text-xs font-semibold text-gray-600">{formatTime(start)}</span>
                  <span className="text-xs text-gray-400">{formatTime(end)}</span>
                </div>
                {/* Day cells */}
                {activeDays.map(day => {
                  const cellSessions = map.get(`${day}|${start}|${end}`) || [];
                  return (
                    <div key={day} className="bg-white min-h-[80px] p-1.5 space-y-1">
                      {cellSessions.map(s => (
                        <button key={s.id} onClick={() => setSelected(s)}
                          className={`w-full text-left rounded-lg p-2 text-xs border cursor-pointer
                                     hover:shadow-sm hover:scale-[1.02] transition-all duration-150
                                     ${COURSE_TYPE_COLORS[s.courseType as CourseType]}`}>
                          <div className="font-semibold truncate">{s.subjectName}</div>
                          <div className="truncate opacity-75">{s.professorName}</div>
                          <div className="flex items-center justify-between mt-0.5 opacity-60">
                            <span>{s.classroomCode}</span>
                            <span className="font-medium">{s.courseType}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Session detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.subjectName}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COURSE_TYPE_COLORS[selected.courseType as CourseType]}`}>
                  {COURSE_TYPE_LABELS[selected.courseType as CourseType]}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Professeur", selected.professorName],
                ["Salle", `${selected.classroomName} (${selected.classroomCode})`],
                ["Groupe", selected.studentGroupName],
                ["Horaire", `${DAY_LABELS[selected.dayOfWeek as DayOfWeek]} ${formatTime(selected.startTime)} – ${formatTime(selected.endTime)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
