import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const AUTH_WORKER_URL = import.meta.env.VITE_AUTH_WORKER_URL || "https://api.try-typescript.com";

export default function Callback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      window.location.href = `${AUTH_WORKER_URL}/auth/callback?code=${code}`;
    } else {
      window.location.href = "/?auth=error";
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f172a]">
      <div className="text-center">
        <Loader2 size={32} className="text-[#3178c6] animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Redirecionando...</p>
      </div>
    </div>
  );
}
