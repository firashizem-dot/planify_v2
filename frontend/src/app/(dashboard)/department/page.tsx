"use client";
import { useEffect, useState } from "react";
import { Users, BookOpen, Building2, CalendarDays, GraduationCap, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import { professorApi, subjectApi, classroomApi, groupApi, scheduleApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function DepartmentDashboard() {
  const { user } = useAuthStore();
  const deptId = user?.departmentId;
  const [stats, setStats] = useState({ professors: 0, subjects: 0, classrooms: 0, groups: 0, schedules: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!deptId) return;
    Promise.all([
      professorApi.getAll(deptId),
      subjectApi.getAll(deptId),
      classroomApi.getAll(),
      groupApi.getAll(deptId),
      scheduleApi.getAll(deptId),
    ]).then(([p, s, c, g, sch]) => {
      setStats({ professors: p.data.length, subjects: s.data.length, classrooms: c.data.length, groups: g.data.length, schedules: sch.data.length });
    }).catch(console.error).finally(() => setIsLoading(false));
  }, [deptId]);

  const cards = [
    { label: "Professeurs",     value: stats.professors, icon: Users,         href: "/department/professors", color: "from-blue-500 to-blue-600" },
    { label: "Matières",        value: stats.subjects,   icon: BookOpen,       href: "/department/subjects",   color: "from-emerald-500 to-emerald-600" },
    { label: "Salles & Labos",  value: stats.classrooms, icon: Building2,      href: "/department/classrooms", color: "from-violet-500 to-violet-600" },
    { label: "Groupes",         value: stats.groups,     icon: GraduationCap,  href: "/department/groups",     color: "from-orange-500 to-orange-600" },
    { label: "Emplois du temps",value: stats.schedules,  icon: CalendarDays,   href: "/department/timetable",  color: "from-primary-500 to-primary-600" },
    { label: "Créneaux horaires",value: "→",             icon: Clock,          href: "/department/timeslots",  color: "from-gray-500 to-gray-600" },
  ];

  return (
    <div className="animate-fade-in">
      <Header title="Département" subtitle={`Tableau de bord du chef de département`} />

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ label, value, icon: Icon, href, color }) => (
            <Link key={href} href={href}
              className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-100
                         p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5">
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? <div className="h-7 w-10 bg-gray-100 animate-pulse rounded" /> : value}
                </div>
                <div className="text-sm text-gray-500 font-medium">{label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick generate */}
        <div className="mt-6 planify-card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Générer un emploi du temps</h3>
              <p className="text-primary-100 text-sm">Utilisez OptaPlanner pour générer automatiquement un emploi du temps optimisé</p>
            </div>
            <Link href="/department/timetable"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm flex-shrink-0">
              Générer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
