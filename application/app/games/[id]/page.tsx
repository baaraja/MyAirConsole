"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`);
        const data = await res.json();
        setGame(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  if (loading) return <p className="p-8 text-center text-white">Chargement du jeu...</p>;
  if (!game) return <p className="p-8 text-center text-red-400">Jeu introuvable</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a1f] via-[#0f051a] to-black text-white p-8">
  <div className="max-w-4xl mx-auto bg-black/50 rounded-xl p-6 shadow-lg backdrop-blur-md border border-[#240046]/20">
        {/* Retour accueil */}
        <div className="mb-4">
          <Link
            href="/sessions/join"
            className="px-4 py-2 bg-gradient-to-r from-[#5a189a]/20 to-[#7b2cbf]/20 hover:from-[#5a189a]/30 hover:to-[#7b2cbf]/30 border border-[#9d4edd]/30 rounded-lg transition-all duration-300"
          >
            ←
          </Link>
        </div>

        {/* Info jeu */}
  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#5a189a] to-[#7b2cbf] bg-clip-text text-transparent">
          Jeu : {game.id}
        </h1>
        <p className="text-2xl mb-2">État : <strong>{game.state}</strong></p>

        {/* Liste des joueurs */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Joueurs :</h2>
          {game.session?.players?.length ? (
            <ul className="list-disc list-inside">
              {game.session.players.map((p: any) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun joueur disponible</p>
          )}
        </div>

        {/* Placeholder Unity WebGL */}
        <div
          id="unity-container"
          className="h-96 w-full bg-black/30 border border-[#240046]/20 rounded-lg flex items-center justify-center text-[#240046]"
        >
          Unity WebGL sera ici
        </div>
        {/* Bouton démarrer le jeu */}
        <div className="text-center">
        <button
          onClick={() => {
            // Ici, tu peux ajouter la logique pour démarrer le jeu (callback, API, etc.)
            const unityDiv = document.getElementById("unity-container");
            if (unityDiv) unityDiv.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#5a189a] to-[#7b2cbf] rounded-lg shadow-md font-semibold text-white hover:from-[#7b2cbf] hover:to-[#5a189a] transition-all"
        >
          Démarrer le jeu
        </button>
        </div>
      </div>
    </div>
  );
}
