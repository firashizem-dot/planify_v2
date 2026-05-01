"use client";
import { useState } from "react";
import { ShieldCheck, ShieldOff, User, Mail, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { QRCodeSVG } from "qrcode.react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "setup" | "verify">("idle");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup2FA = async () => {
    setIsLoading(true);
    try {
      const r = await authApi.setup2fa();
      setQrUri(r.data.otpAuthUri);
      setSecret(r.data.secret);
      setStep("setup");
    } catch { setMessage("Erreur lors de la configuration 2FA"); }
    finally { setIsLoading(false); }
  };

  const handleEnable2FA = async () => {
    if (!code || code.length !== 6) { setMessage("Entrez un code à 6 chiffres"); return; }
    setIsLoading(true);
    try {
      await authApi.enable2fa(parseInt(code));
      setMessage("✓ 2FA activé avec succès !");
      setStep("idle");
    } catch { setMessage("Code invalide. Réessayez."); }
    finally { setIsLoading(false); }
  };

  const handleDisable2FA = async () => {
    if (!confirm("Désactiver la 2FA ?")) return;
    await authApi.disable2fa();
    setMessage("2FA désactivé.");
  };

  return (
    <div className="animate-fade-in">
      <Header title="Profil" subtitle="Gérez votre compte et la sécurité" />
      <div className="p-6 max-w-2xl space-y-5">
        {/* Profile card */}
        <div className="planify-card">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{user?.fullName?.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
              <span className="text-sm bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                {user?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />{user?.email}
            </div>
            {user?.departmentId && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-gray-400" />Département #{user.departmentId}
              </div>
            )}
          </div>
        </div>

        {/* 2FA card */}
        <div className="planify-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Authentification à deux facteurs (2FA)</h3>
              <p className="text-xs text-gray-500">Sécurisez votre compte avec Google Authenticator</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm mb-4 ${message.startsWith("✓") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          {step === "idle" && (
            <div className="flex gap-3">
              <button onClick={handleSetup2FA} disabled={isLoading}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <ShieldCheck className="w-4 h-4" />Configurer la 2FA
              </button>
              <button onClick={handleDisable2FA}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <ShieldOff className="w-4 h-4" />Désactiver
              </button>
            </div>
          )}

          {step === "setup" && qrUri && (
            <div className="animate-fade-in">
              <p className="text-sm text-gray-600 mb-4">
                Scannez ce QR code avec votre application Google Authenticator :
              </p>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl">
                  <QRCodeSVG value={qrUri} size={180} />
                </div>
              </div>
              {secret && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Clé secrète (saisie manuelle)</p>
                  <code className="text-sm font-mono font-bold text-gray-800">{secret}</code>
                </div>
              )}
              <div className="flex gap-3">
                <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code à 6 chiffres"
                  maxLength={6} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-mono text-lg tracking-widest" />
                <button onClick={handleEnable2FA} disabled={isLoading}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  {isLoading ? "..." : "Activer"}
                </button>
                <button onClick={() => setStep("idle")} className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm">Annuler</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
