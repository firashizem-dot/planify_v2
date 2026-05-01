"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { LoginResponse } from "@/types";

export default function Verify2FAPage() {
  const router = useRouter();
  const { pendingEmail, login } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newCode.every(d => d !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeStr: string) => {
    if (!pendingEmail) { router.push("/login"); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await authApi.verify2fa({ email: pendingEmail, code: parseInt(codeStr) });
      const response: LoginResponse = res.data;
      login(response.token!, response.email, response.fullName!, response.role!, response.departmentId);
      switch (response.role) {
        case "ADMIN":           router.push("/admin"); break;
        case "DEPARTMENT_HEAD": router.push("/department"); break;
        case "PROFESSOR":       router.push("/professor"); break;
        case "STUDENT":         router.push("/student"); break;
      }
    } catch {
      setError("Code invalide. Vérifiez votre application d'authentification.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vérification 2FA</h1>
          <p className="text-gray-500 text-sm mt-2">
            Entrez le code de votre application Google Authenticator
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-center mb-6">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl
                           focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                           transition-all bg-gray-50"
              />
            ))}
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <button
            onClick={() => router.push("/login")}
            className="w-full text-center text-sm text-gray-500 hover:text-primary-500 transition-colors mt-4"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
