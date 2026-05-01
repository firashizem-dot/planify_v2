"use client";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthStore();
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.fullName?.charAt(0) || "U"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-none">{user?.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
