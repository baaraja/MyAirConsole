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
      <div className="max-w-4xl mx-auto bg-black/50 rounded-xl p-6 shadow-lg backdrop-blur-md border border-[#F49C9C]/20">
        {/* Retour accueil */}
        <div className="mb-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-[#C174F2]/20 to-[#F18585]/20 hover:from-[#C174F2]/30 hover:to-[#F18585]/30 border border-[#CB90F1]/30 rounded-lg transition-all duration-300"
          >
            ←
          </Link>
        </div>

        {/* Info jeu */}
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#F18585] to-[#F49C9C] bg-clip-text text-transparent">
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
          className="h-96 w-full bg-black/30 border border-[#F49C9C]/20 rounded-lg flex items-center justify-center text-[#F49C9C]"
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
          className="mt-4 px-4 py-2 bg-gradient-to-r from-[#C174F2] to-[#F18585] rounded-lg shadow-md font-semibold text-white hover:from-[#F18585] hover:to-[#C174F2] transition-all"
        >
          Démarrer le jeu
        </button>
        </div>
      </div>
    </div>
  );
}
