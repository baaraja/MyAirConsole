'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getSocket } from "@/lib/socket";

export default function SessionPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { data: userSession } = useSession();
  const socket = getSocket();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCode = urlParams.get("code");
      if (urlCode && urlCode.trim() !== "") {
        setCode(urlCode);
        // Auto-joindre pour tous (connectés et invités)
        if (!currentSession || currentSession.code !== urlCode) {
          setTimeout(() => {
            handleJoin();
          }, 100);
        }
      }
    }
  }, [userSession]);

  useEffect(() => {
    const storedSession = sessionStorage.getItem('activeGameSession');
    const storedPlayerId = sessionStorage.getItem('playerId');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        fetch(`/api/sessions/${sessionData.code}`)
          .then(res => res.ok ? res.json() : null)
          .then(validSession => {
            if (!validSession) {
              sessionStorage.removeItem('activeGameSession');
              setCurrentSession(null);
              return;
            }
            const isHost = userSession?.user?.id === validSession.hostId;
            const isPlayer = validSession.players?.some((p: any) =>
              (userSession?.user?.id && p.userId === userSession.user.id) ||
              (storedPlayerId && p.id === storedPlayerId)
            );
            if (isHost || isPlayer) {
              setCurrentSession(validSession);
              socket.emit('joinSession', validSession.code, {
                id: sessionStorage.getItem('playerId') || socket.id,
                name: sessionStorage.getItem('playerName') || `Invité-${(socket.id ?? '0000').slice(0, 4)}`
              });
            }
          });
      } catch {
        sessionStorage.removeItem('activeGameSession');
        setCurrentSession(null);
      }
    } else {
      setCurrentSession(null);
    }
  }, [userSession]);

  useEffect(() => {
    if (!currentSession) return;
    const handlePlayerJoined = (player: any) => {
      setCurrentSession((prev: any) => {
        const exists = (prev.players || []).some((p: any) => p.id === player.id);
        if (!prev || exists) return prev;
        return { ...prev, players: [...(prev.players || []), player] };
      });
    };

    const handlePlayerLeft = (playerId: string) => {
      setCurrentSession((prev: any) => {
        if (!prev) return prev;
        return { ...prev, players: (prev.players || []).filter((p: any) => p.id !== playerId) };
      });
    };
    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_left', handlePlayerLeft);
    socket.on('controller_input', (data: any) => console.log('Input reçu:', data));
    
    // Debug Socket.IO
    socket.on('connect', () => console.log('✅ Socket connecté:', socket.id));
    socket.on('disconnect', () => console.log('❌ Socket déconnecté'));
    socket.on('connect_error', (error: any) => console.error('🔥 Erreur Socket:', error));
    return () => {
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_left', handlePlayerLeft);
      socket.off('controller_input');
    };
  }, [currentSession]);

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      const storedPlayerId = sessionStorage.getItem('playerId');
      const storedSession = sessionStorage.getItem('activeGameSession');
      if (code && storedPlayerId && storedSession) {
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession.code === code) {
          setCurrentSession(parsedSession);
          setLoading(false);
          return;
        }
      }
      
      let data;
      if (code && code.trim() !== "") {
        const res = await fetch(`/api/sessions/${code}/join`, { method: "POST" });
        data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        if (data.player && data.gameSession) {
          const sessionData = {
            id: data.gameSession.id,
            code: data.gameSession.code,
            hostId: data.gameSession.hostId,
            host: data.gameSession.host,
            players: data.gameSession.players,
            player: data.player,
          };
          sessionStorage.setItem('activeGameSession', JSON.stringify(sessionData));
          sessionStorage.setItem('playerId', data.player.id);
          sessionStorage.setItem('playerName', data.player.name);
          setSession(sessionData);
          const res2 = await fetch(`/api/sessions/${data.gameSession.code}`);
          if (res2.ok) {
            const validSession = await res2.json();
            setCurrentSession(validSession);
          } else {
            setCurrentSession(sessionData);
          }
          setLoading(false);
          return;
        }
      } else {
        if (currentSession && !code) {
          sessionStorage.removeItem('activeGameSession');
          setCurrentSession(null);
        }
        const res = await fetch(`/api/sessions`, { method: "POST" });
        data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        sessionStorage.setItem('activeGameSession', JSON.stringify(data));
        if (data.player?.id) sessionStorage.setItem('playerId', data.player.id);
        if (data.player?.name) sessionStorage.setItem('playerName', data.player.name);
        setSession(data);
        setCurrentSession(data);
        setLoading(false);
        return;
      }
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
      const storedPlayerId = sessionStorage.getItem('playerId');
      if (userSession?.user?.id === currentSession.hostId) {
        await fetch(`/api/sessions/${currentSession.code}`, { method: 'DELETE' });
      } else if (storedPlayerId) {
        await fetch(`/api/sessions/${currentSession.code}/join?playerId=${storedPlayerId}`, { method: 'DELETE' });
      }
      sessionStorage.removeItem('activeGameSession');
      sessionStorage.removeItem('playerId');
      sessionStorage.removeItem('playerName');
      setCurrentSession(null);
      setSession(null);
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression de la session ou du joueur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejoinSession = () => {
    if (currentSession) router.push(`/games/${currentSession.id}`);
  };

  const uniquePlayers = currentSession ?
    Array.from(new Map((currentSession.players || []).map(p => [p.id, p])).values()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-black/70 backdrop-blur-md border border-[#5a189a]/20 rounded-xl p-6 space-y-6 shadow-lg">
        {/* Header avec navigation et contrôleur */}
        <div className="flex justify-between items-center">
          <Link 
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-[#5a189a]/20 to-[#7b2cbf]/20 hover:from-[#5a189a]/30 hover:to-[#7b2cbf]/30 border border-[#9d4edd]/30 rounded-lg transition-all duration-300 backdrop-blur-sm text-sm"
          >
            ←
          </Link>
          
          <button
            onClick={() => {
              if (currentSession?.code) {
                window.open(`/sessions/${currentSession.code}/controller`, '_blank');
              } else {
                const code = prompt("Code de session pour la manette :");
                if (code && code.trim()) {
                  window.open(`/sessions/${code.trim()}/controller`, '_blank');
                }
              }
            }}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            title={currentSession?.code ? `Contrôleur pour ${currentSession.code}` : "Ouvrir contrôleur mobile"}
          >
            🎮
          </button>
        </div>
        {/* Afficher la session active pour l'hôte ou joueur existant */}
        {currentSession && (() => {
          const storedPlayerId = sessionStorage.getItem('playerId');
          if (userSession?.user?.id === currentSession.hostId)
            return true;
          if (storedPlayerId && currentSession.players?.some((p: any) => p.id === storedPlayerId))
            return true;
          return false;
        })() && (
          <div className="p-4 bg-gradient-to-br from-[#5a189a]/20 to-[#7b2cbf]/20 border border-[#9d4edd]/30 rounded-lg">
            <div className="mb-2 flex flex-col items-center">
              <span className="text-xs text-[#e0aaff]/70">Numéro de session</span>
              <span className="text-lg font-bold text-[#5a189a]">{currentSession.id}</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <span className="text-xs text-[#e0aaff]/70">Code</span>
              <button
                className="ml-2 px-2 py-1 bg-[#240046]/30 rounded text-[#5a189a] font-mono text-base hover:bg-[#10002b]/30 transition-all"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}/sessions/join?code=${currentSession.code}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                title="Copier le lien d'invitation"
              >
                {currentSession.code}
              </button>
              {copied && <span className="ml-2 text-green-400 text-xs">Lien copié !</span>}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-center">Joueurs connectés</h3>
              <ul className="flex flex-wrap gap-2 justify-center">
                {currentSession.host && (
                  <li
                    key={`host-${currentSession.host.id}`}
                    className="px-3 py-1 bg-[#e0aaff]/30 rounded-full text-sm font-semibold text-[#10002b] border border-[#10002b]/50"
                  >
                    {currentSession.host.name || currentSession.host.email} <span className="text-xs text-[#10002b]">(Hôte)</span>
                  </li>
                )}
                {uniquePlayers
                  .filter((p: any) => p.id !== currentSession.host?.id)
                  .map((player: any) => {
                    const storedPlayerId = sessionStorage.getItem('playerId');
                    const storedPlayerName = sessionStorage.getItem('playerName');
                    const isCurrent =
                      (storedPlayerId && player.id === storedPlayerId) ||
                      (session?.player?.id && player.id === session.player.id);
                    return (
                      <li
                        key={`player-${player.id}`}
                        className="px-3 py-1 bg-[#e0aaff]/30 rounded-full text-sm font-semibold text-[#10002b] border border-[#10002b]/50"
                      >
                        {isCurrent && storedPlayerName ? storedPlayerName : player.name}{" "}
                        {isCurrent && <span className="text-xs text-[#10002b]">(Vous)</span>}
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
                {(userSession?.user?.id === currentSession.hostId || (sessionStorage.getItem('playerId') && currentSession.players?.some((p: any) => p.id === sessionStorage.getItem('playerId')))) && (
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
      </div>
    </div>
  );
}
