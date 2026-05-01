"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Redirect to role-specific dashboard
    switch (user?.role) {
      case "ADMIN":         router.replace("/admin"); break;
      case "DEPARTMENT_HEAD": router.replace("/department"); break;
      case "PROFESSOR":    router.replace("/professor"); break;
      case "STUDENT":      router.replace("/student"); break;
      default:             router.replace("/login");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
    </div>
  );
}
