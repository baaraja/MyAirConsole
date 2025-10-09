"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSocket } from "@/lib/socket";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;
  const [session, setSession] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const socket = getSocket();
  const GRID_COLS = 4;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const resSession = await fetch(`/api/sessions/${sessionId}`);
        const dataSession = await resSession.json();
        setSession(dataSession);
        const resGames = await fetch(`/api/games/${sessionId}`);
        const dataGames = await resGames.json();
        setGames(dataGames || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!socket || !games.length) return;
    const handleInput = (data: { direction: string }) => {
      const rowCount = Math.ceil(games.length / GRID_COLS);
      const colCount = GRID_COLS;
      let row = Math.floor(selectedIndex / colCount);
      let col = selectedIndex % colCount;
      if (data.direction === "up") row = Math.max(row - 1, 0);
      if (data.direction === "down") row = Math.min(row + 1, rowCount - 1);
      if (data.direction === "left") {
        col--;
        if (col < 0) {
          row = Math.max(row - 1, 0);
          col = row === 0 ? 0 : colCount - 1;
        }
      }
      if (data.direction === "right") {
        col++;
        if (col >= colCount) {
          row = Math.min(row + 1, rowCount - 1);
          col = 0;
        }
      }
      const newIndex = row * colCount + col;
      if (newIndex < games.length) setSelectedIndex(newIndex);
      if (data.direction === "action") handleStartGame(games[selectedIndex]);
    };
    socket.on("controller_input", handleInput);
    return () => socket.off("controller_input", handleInput);
  }, [socket, games, selectedIndex]);

  useEffect(() => {
    const el = document.getElementById(`game-${selectedIndex}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [selectedIndex]);

  const handleStartGame = async (game: any) => {
    if (!game) return;
    try {
      await fetch(`/api/games/${game.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "started" }),
      });
      const unityDiv = document.getElementById("unity-container");
      if (unityDiv) unityDiv.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Erreur démarrage du jeu:", err);
    }
  };

  if (loading) return <p className="p-8 text-center text-white">Chargement...</p>;
  if (!session) return <p className="p-8 text-center text-red-400">Session introuvable</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black text-white p-8">
      <div className="max-w-6xl mx-auto bg-black/50 rounded-xl p-6 shadow-lg backdrop-blur-md border border-[#240046]/20">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/sessions/join" className="px-4 py-2 bg-gradient-to-r from-[#5a189a]/20 to-[#7b2cbf]/20 border border-[#9d4edd]/30 rounded-lg">
            ←
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Contrôleur mobile :</span>
            <button
              onClick={() => window.open(`/sessions/${session.code}/controller`, '_blank')}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              title={`Contrôleur pour ${session.code}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V14C18 15.1046 17.1046 16 16 16H8C6.89543 16 6 15.1046 6 14V10Z"
                  fill="currentColor"
                />
                <path
                  d="M4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H6V11H4Z"
                  fill="currentColor"
                />
                <path
                  d="M20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H18V11H20Z"
                  fill="currentColor"
                />
                <rect x="8" y="10.5" width="1.5" height="3" fill="white" rx="0.2" />
                <rect x="7.25" y="11.25" width="3" height="1.5" fill="white" rx="0.2" />
                <circle cx="15" cy="11" r="0.8" fill="white" />
                <circle cx="16.5" cy="12.5" r="0.8" fill="white" />
              </svg>
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#5a189a] to-[#7b2cbf] bg-clip-text text-transparent">
          Session : {session.code}
        </h1>
        
        {/* BOUTON TEST TRÈS VISIBLE */}
        <div className="mb-6 p-4 bg-red-500 rounded-lg">
          <button
            onClick={() => window.open(`/sessions/${session.code}/controller`, '_blank')}
            className="w-full p-4 bg-yellow-500 text-black font-bold rounded-lg text-xl"
          >
            🎮 OUVRIR CONTRÔLEUR MOBILE - {session.code}
          </button>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Joueurs :</h2>
          {session.players?.length ? (
            <ul className="list-disc list-inside">
              {session.players.map((p: any) => <li key={p.id}>{p.name}</li>)}
            </ul>
          ) : <p>Aucun joueur</p>}
        </div>
        <div
          id="unity-container"
          className="h-96 w-full bg-black/30 border border-[#240046]/20 rounded-lg flex items-center justify-center text-[#240046] mb-6"
        >
          Unity WebGL sera ici
        </div>
        <div className="grid grid-cols-4 gap-4 overflow-hidden max-h-[60vh] p-2 border border-[#240046]/20 rounded-lg">
          {games.map((g, i) => (
            <div
              id={`game-${i}`}
              key={g.id}
              className={`cursor-pointer p-4 rounded-lg text-center transition transform ${
                i === selectedIndex
                  ? "bg-purple-600 text-white font-bold scale-105 shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => handleStartGame(g)}
            >
              <div className="h-24 w-full bg-gray-900 mb-2 flex items-center justify-center rounded">
                Thumbnail
              </div>
              <div>{`Game ${g.id}`}</div>
              <div className="text-sm text-gray-400">{g.state}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
