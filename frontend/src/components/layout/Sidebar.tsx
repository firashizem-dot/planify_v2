"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, Building2, CalendarDays,
  Clock, GraduationCap, Settings, LogOut, ChevronLeft, ChevronRight,
  UserCog, Sparkles
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Tableau de bord", href: "/admin",         icon: LayoutDashboard, roles: ["ADMIN"] },
  { label: "Chefs de dept.",  href: "/admin/department-heads", icon: UserCog, roles: ["ADMIN"] },
  { label: "Tableau de bord", href: "/department",    icon: LayoutDashboard, roles: ["DEPARTMENT_HEAD"] },
  { label: "Professeurs",     href: "/department/professors", icon: Users,   roles: ["ADMIN", "DEPARTMENT_HEAD"] },
  { label: "Matières",        href: "/department/subjects",   icon: BookOpen, roles: ["ADMIN", "DEPARTMENT_HEAD"] },
  { label: "Salles",          href: "/department/classrooms", icon: Building2, roles: ["ADMIN", "DEPARTMENT_HEAD"] },
  { label: "Groupes",         href: "/department/groups",     icon: GraduationCap, roles: ["ADMIN", "DEPARTMENT_HEAD"] },
  { label: "Créneaux",        href: "/department/timeslots",  icon: Clock,   roles: ["ADMIN", "DEPARTMENT_HEAD"] },
  { label: "Emplois du temps",href: "/department/timetable",  icon: CalendarDays, roles: ["ADMIN", "DEPARTMENT_HEAD"] },
  { label: "Mon EDT",         href: "/professor",     icon: CalendarDays,   roles: ["PROFESSOR"] },
  { label: "Mon EDT",         href: "/student",       icon: CalendarDays,   roles: ["STUDENT"] },
  { label: "Profil",          href: "/profile",       icon: Settings,       roles: ["ADMIN", "DEPARTMENT_HEAD", "PROFESSOR", "STUDENT"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const filtered = navItems.filter(item => user?.role && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className={cn(
      "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Planify</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary-500" : "")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-800 truncate">{user.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {user.role?.replace("_", " ")}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium",
            "text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && "Déconnexion"}
        </button>
      </div>
    </aside>
  );
}
