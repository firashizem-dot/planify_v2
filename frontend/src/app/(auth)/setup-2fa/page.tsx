"use client";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function Setup2FAPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldCheck className="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Configuration 2FA</h1>
        <p className="text-gray-500 mt-2">Accédez à votre profil pour configurer la 2FA.</p>
        <button onClick={() => router.push("/profile")}
          className="mt-6 bg-primary-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
          Aller au profil
        </button>
      </div>
    </div>
  );
}
