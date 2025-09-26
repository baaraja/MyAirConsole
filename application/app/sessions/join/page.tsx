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
    if (currentSession) {
      const storedPlayerId = sessionStorage.getItem('playerId');
      const isHost = userSession?.user?.id === currentSession.hostId;
      const isPlayer = currentSession.players && currentSession.players.some((p: any) =>
        p.userId === userSession?.user?.id || (storedPlayerId && p.id === storedPlayerId)
      );
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

      // Stocker la session et l'id du joueur dans sessionStorage
      sessionStorage.setItem('activeGameSession', JSON.stringify(data));
      if (data.player?.id) {
        sessionStorage.setItem('playerId', data.player.id);
      }
      setSession(data);
      setCurrentSession(data);
      
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
      sessionStorage.removeItem('activeGameSession');
      setCurrentSession(null);
      setSession(null);
      setError(""); 
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
      <div className="max-w-lg w-full bg-black/70 backdrop-blur-md border border-[#5a189a]/20 rounded-xl p-6 space-y-6 shadow-lg">
        {/* Bouton retour accueil */}
        <div className="flex justify-start">
          <Link 
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-[#5a189a]/20 to-[#7b2cbf]/20 hover:from-[#5a189a]/30 hover:to-[#7b2cbf]/30 border border-[#9d4edd]/30 rounded-lg transition-all duration-300 backdrop-blur-sm text-sm"
          >
            ←
          </Link>
        </div>

        {/* Afficher la session active pour l'hôte ou tout joueur (invité ou connecté) qui vient de rejoindre */}
        {currentSession && (
          (userSession?.user?.id === currentSession.hostId ||
            (currentSession.players && currentSession.players.some((p: any) => {
              const storedPlayerId = sessionStorage.getItem('playerId');
              return (
                p.userId === userSession?.user?.id ||
                (session?.player?.id && p.id === session.player.id) ||
                (storedPlayerId && p.id === storedPlayerId)
              );
            }))
          )
        ) && (
          <div className="p-4 bg-gradient-to-br from-[#5a189a]/20 to-[#7b2cbf]/20 border border-[#9d4edd]/30 rounded-lg">
            {/* Numéro de session affiché en haut si session active */}
            <div className="mb-2 flex flex-col items-center">
              <span className="text-xs text-[#e0aaff]/70">Numéro de session</span>
              <span className="text-lg font-bold text-[#5a189a]">{currentSession.id}</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <span className="text-xs text-[#e0aaff]/70">Code</span>
              <button
                className="ml-2 px-2 py-1 bg-[#240046]/30 rounded text-[#5a189a] font-mono text-base hover:bg-[#10002b]/30 transition-all"
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
                  <li key={currentSession.host.id || 'host'} className="px-3 py-1 bg-[#e0aaff]/30 rounded-full text-sm font-semibold text-[#10002b] border border-[#10002b]/50">
                    {currentSession.host.name || currentSession.host.email} <span className="text-xs text-[#10002b]">(Hôte)</span>
                  </li>
                )}
                {/* Tous les joueurs (y compris l'hôte) ont le même style */}
                {currentSession.players && currentSession.players.map((player: any) => {
                  const isCurrent = session?.player?.id && player.id === session.player.id;
                  // Style identique à l'hôte
                  return (
                    <li key={player.id} className={`px-3 py-1 bg-[#e0aaff]/30 rounded-full text-sm font-semibold text-[#10002b] border border-[#10002b]/50`}>
                      {player.name} {isCurrent && <span className="text-xs text-[#10002b]">(Vous)</span>}
                    </li>
                  );
                })}
              </ul>
              {(!currentSession.players || currentSession.players.length === 0) && !currentSession.host && (
                <p className="text-center text-[#e0aaff]/70">Aucun joueur connecté</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex sm:flex-row gap-3">
                <button
                  onClick={handleRejoinSession}
                  className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-400/20 hover:from-red-500/30 hover:to-red-400/30 border border-red-400/30 text-red-300 rounded-lg transition-all duration-300 text-left backdrop-blur-sm"
                >
                  Rejoindre la partie
                </button>
                {/* Ne montrer le bouton "Quitter" que si l'utilisateur est l'hôte */}
                {userSession?.user?.id === currentSession.hostId && (
                  <button
                    onClick={handleLeaveSession}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-400/20 hover:from-red-500/30 hover:to-red-400/30 border border-red-400/30 text-red-300 rounded-lg transition-all duration-300 text-left backdrop-blur-sm"
                  >
                    {loading ? "Leaving..." : "Quitter la session"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#5a189a] to-[#7b2cbf] bg-clip-text text-transparent">
          Rejoindre ou créer une session
        </h1>
        <p className="text-center text-[#e0aaff]/70">
          Entrez le code d'une session pour la rejoindre, ou laissez vide pour créer une nouvelle partie
        </p>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Code de session"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#7b2cbf]/30 focus:outline-none focus:border-[#10002b]/50 focus:ring-1 focus:ring-[#10002b]/20"
          />
          <button
            onClick={handleJoin}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#5a189a] to-[#7b2cbf] hover:from-[#7b2cbf] hover:to-[#5a189a] rounded-lg font-semibold shadow-md hover:shadow-[#10002b]/40 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Traitement..." : code ? "Rejoindre la session" : "Créer une session"}
          </button>
        </div>

        {session && !currentSession && (
          <div className="mt-4 p-4 bg-gradient-to-br from-[#5a189a]/20 to-[#7b2cbf]/20 border border-[#9d4edd]/30 rounded-lg text-center">
            <p className="mb-2">
              Session créée ! Code : <strong>{session.code}</strong>
            </p>
            <button
              onClick={() => router.push(`/games/${session.id}`)}
              className="px-4 py-2 bg-gradient-to-r from-[#10002b] to-[#240046] hover:from-[#240046] hover:to-[#10002b] rounded-lg shadow-md font-semibold"
            >
              Démarrer le jeu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
