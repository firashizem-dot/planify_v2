"use client";
import { useEffect, useState } from "react";
import { Users, Building2, GraduationCap, BarChart3, ArrowUpRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { adminApi } from "@/lib/api";

interface Stats { heads: number; departments: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ heads: 0, departments: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getDepartmentHeads(), adminApi.getDepartments()])
      .then(([heads, depts]) => {
        setStats({ heads: heads.data.length, departments: depts.data.length });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { label: "Chefs de Département", value: stats.heads, icon: Users, color: "bg-blue-50 text-blue-600", change: "+2 ce mois" },
    { label: "Départements", value: stats.departments, icon: Building2, color: "bg-primary-50 text-primary-600", change: "Actifs" },
    { label: "Emplois du temps", value: "—", icon: BarChart3, color: "bg-green-50 text-green-600", change: "Voir le module" },
    { label: "Utilisateurs totaux", value: "—", icon: GraduationCap, color: "bg-purple-50 text-purple-600", change: "Tous rôles" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Header title="Administration" subtitle="Vue d'ensemble du système Planify" />

      <div className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="planify-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? <div className="h-7 w-12 bg-gray-100 animate-pulse rounded" /> : value}
              </div>
              <div className="text-sm font-medium text-gray-600">{label}</div>
              <div className="text-xs text-gray-400 mt-1">{change}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-6 planify-card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Gérer les chefs de département", href: "/admin/department-heads", color: "bg-primary-500" },
              { label: "Voir tous les départements", href: "/admin/departments", color: "bg-blue-500" },
              { label: "Configuration système", href: "/profile", color: "bg-gray-600" },
            ].map(({ label, href, color }) => (
              <a key={href} href={href}
                className={`${color} text-white rounded-xl p-4 text-sm font-medium hover:opacity-90 transition-opacity`}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
