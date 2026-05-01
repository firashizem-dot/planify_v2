"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { LoginResponse } from "@/types";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, setPendingEmail } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await authApi.login(data);
      const response: LoginResponse = res.data;

      if (response.twoFactorRequired) {
        // 2FA required - redirect to verification
        setPendingEmail(data.email);
        router.push("/verify-2fa");
        return;
      }

      // Normal login success
      login(response.token!, response.email, response.fullName!, response.role!, response.departmentId);

      // Redirect based on role
      switch (response.role) {
        case "ADMIN":           router.push("/admin"); break;
        case "DEPARTMENT_HEAD": router.push("/department"); break;
        case "PROFESSOR":       router.push("/professor"); break;
        case "STUDENT":         router.push("/student"); break;
        default:                router.push("/");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Planify</h1>
          <p className="text-gray-500 mt-1 text-sm">Gestion des Emplois du Temps</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Connexion</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all bg-gray-50 hover:bg-white"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connexion...</>
              ) : "Se connecter"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Admin", email: "admin@planify.com", color: "bg-red-50 text-red-700" },
                { label: "Chef Dept.", email: "head.info@planify.com", color: "bg-blue-50 text-blue-700" },
                { label: "Professeur", email: "prof.karim@planify.com", color: "bg-green-50 text-green-700" },
                { label: "Étudiant", email: "student.ali@planify.com", color: "bg-purple-50 text-purple-700" },
              ].map(({ label, email, color }) => (
                <div key={label} className={`${color} rounded-lg p-2 text-center`}>
                  <div className="font-semibold">{label}</div>
                  <div className="truncate opacity-75">{email}</div>
                  <div className="opacity-60">Admin123!</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
