'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SessionPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { data: userSession } = useSession();

  // Vérifier s'il y a déjà une session active au chargement
  useEffect(() => {
    // Vérification à chaque affichage : si l'utilisateur n'est pas membre, supprimer la session
    if (currentSession && userSession?.user?.id) {
      const isHost = userSession.user.id === currentSession.hostId;
      const isPlayer = currentSession.players && currentSession.players.some((p: any) => p.userId === userSession.user.id);
      if (!isHost && !isPlayer) {
        sessionStorage.removeItem('activeGameSession');
        setCurrentSession(null);
      }
    }
    const storedSession = sessionStorage.getItem('activeGameSession');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        // Vérifier que la session est encore valide
        checkSessionValidity(sessionData);
      } catch (e) {
        // Session corrompue, la supprimer
        sessionStorage.removeItem('activeGameSession');
      }
    }
  }, []);

  const checkSessionValidity = async (sessionData: any) => {
    try {
      // Utiliser l'endpoint existant avec le code de la session
      const res = await fetch(`/api/sessions/${sessionData.code}`);
      if (res.ok) {
        const validSession = await res.json();
        setCurrentSession(validSession);
      } else {
        // Session n'existe plus, nettoyer le storage
        sessionStorage.removeItem('activeGameSession');
      }
    } catch (e) {
      sessionStorage.removeItem('activeGameSession');
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    setError("");

    try {
      if (currentSession && !code) {
        sessionStorage.removeItem('activeGameSession');
        setCurrentSession(null);
      }

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

      // Stocker la session dans sessionStorage
      sessionStorage.setItem('activeGameSession', JSON.stringify(data));
      setSession(data);
      setCurrentSession(data);
      
      router.push(`/games/${data.id}`);
    } catch (err) {
      setError("Erreur serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSession = async () => {
    if (!currentSession) return;
    
    setLoading(true);
    try {
      // Supprimer la session de la base de données
      const res = await fetch(`/api/sessions/${currentSession.code}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        // Supprimer du storage local et mettre à jour l'état
        sessionStorage.removeItem('activeGameSession');
        setCurrentSession(null);
        setSession(null);
        setError(""); 
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la session");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejoinSession = () => {
    if (currentSession) {
      router.push(`/games/${currentSession.id}`);
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

        {/* Afficher la session active uniquement pour l'hôte ou les joueurs de la session */}
        {currentSession && (
          (userSession?.user?.id === currentSession.hostId ||
            (currentSession.players && currentSession.players.some((p: any) => p.userId === userSession?.user?.id)))
        ) && (
          <div className="p-4 bg-gradient-to-br from-[#C174F2]/20 to-[#F18585]/20 border border-[#CB90F1]/30 rounded-lg">
            {/* Numéro de session affiché en haut si session active */}
            <div className="mb-2 flex flex-col items-center">
              <span className="text-xs text-[#EED5FB]/70">Numéro de session</span>
              <span className="text-lg font-bold text-[#F18585]">{currentSession.id}</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <span className="text-xs text-[#EED5FB]/70">Code</span>
              <button
                className="ml-2 px-2 py-1 bg-[#C174F2]/30 rounded text-[#F18585] font-mono text-base hover:bg-[#F18585]/30 transition-all"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/sessions/join?code=${currentSession.code}`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                title="Copier le lien d'invitation"
              >
                {currentSession.code}
              </button>
              {copied && (
                <span className="ml-2 text-green-400 text-xs">Lien copié !</span>
              )}
            </div>
            {/* Liste des joueurs connectés */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-center">Joueurs connectés</h3>
              <ul className="flex flex-wrap gap-2 justify-center">
                {/* Afficher l'hôte en premier, même s'il n'est pas dans players */}
                {currentSession.host && (
                  <li key={currentSession.host.id || 'host'} className="px-3 py-1 bg-[#F18585]/30 rounded-full text-sm font-semibold text-[#F18585] border border-[#F18585]/50">
                    {currentSession.host.name || currentSession.host.email} <span className="text-xs text-[#F18585]">(Hôte)</span>
                  </li>
                )}
                {/* Afficher les autres joueurs (hors hôte) */}
                {currentSession.players && currentSession.players
                  .filter((player: any) => player.userId !== currentSession.hostId)
                  .map((player: any) => (
                    <li key={player.id} className="px-3 py-1 bg-[#C174F2]/30 rounded-full text-sm">
                      {player.name}
                    </li>
                  ))}
              </ul>
              {(!currentSession.players || currentSession.players.length === 0) && !currentSession.host && (
                <p className="text-center text-[#EED5FB]/70">Aucun joueur connecté</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex sm:flex-row gap-3">
                <button
                  onClick={handleRejoinSession}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 rounded-lg font-semibold shadow-md transition-all duration-300 disabled:opacity-50"
                >
                  Rejoindre la partie
                </button>
                {/* Ne montrer le bouton "Quitter" que si l'utilisateur est l'hôte */}
                {userSession?.user?.id === currentSession.hostId && (
                  <button
                    onClick={handleLeaveSession}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 rounded-lg font-semibold shadow-md transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Suppression..." : "Supprimer la session"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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

        {session && !currentSession && (
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
