'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SessionPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    setError("");

    try {
      let data;
      if (code) {
        // Rejoindre une session existante
        const res = await fetch(`/api/sessions/${code}/join`, { method: "POST" });
        data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
      } else {
        // Créer une nouvelle session
        const res = await fetch(`/api/sessions`, { method: "POST" });
        data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
      }

      setSession(data);
      router.push(`/games/${data.id || data.gameSession?.id}`);
    } catch (err) {
      setError("Erreur serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-black/70 backdrop-blur-md border border-[#C174F2]/20 rounded-xl p-6 space-y-6 shadow-lg">
        {/* Bouton retour accueil */}
        <div className="flex justify-start">
          <Link 
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-[#C174F2]/20 to-[#F18585]/20 hover:from-[#C174F2]/30 hover:to-[#F18585]/30 border border-[#CB90F1]/30 rounded-lg transition-all duration-300 backdrop-blur-sm text-sm"
          >
            ←
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#C174F2] to-[#F18585] bg-clip-text text-transparent">
          Rejoindre ou créer une session
        </h1>
        <p className="text-center text-[#EED5FB]/70">
          Entrez le code d'une session pour la rejoindre, ou laissez vide pour créer une nouvelle partie
        </p>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Code de session"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#C174F2]/30 focus:outline-none focus:border-[#F18585]/50 focus:ring-1 focus:ring-[#F18585]/20"
          />
          <button
            onClick={handleJoin}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#C174F2] to-[#F18585] hover:from-[#F18585] hover:to-[#C174F2] rounded-lg font-semibold shadow-md hover:shadow-[#F18585]/40 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Traitement..." : code ? "Rejoindre la session" : "Créer une session"}
          </button>
        </div>

        {session && (
          <div className="mt-4 p-4 bg-gradient-to-br from-[#C174F2]/20 to-[#F18585]/20 border border-[#CB90F1]/30 rounded-lg text-center">
            <p className="mb-2">
              Session créée ! Code : <strong>{session.code}</strong>
            </p>
            <button
              onClick={() => router.push(`/games/${session.id}`)}
              className="px-4 py-2 bg-gradient-to-r from-[#F18585] to-[#F49C9C] hover:from-[#F49C9C] hover:to-[#F18585] rounded-lg shadow-md font-semibold"
            >
              Démarrer le jeu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
