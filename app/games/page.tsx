"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch("/api/games");
      const data = await res.json();
      setGames(data.games || []);
      setLoading(false);
    };
    fetchGames();
  }, []);

  if (loading) return <p>Chargement des jeux...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catalogue de jeux</h1>
      {games.length === 0 ? (
        <p>Aucun jeu disponible pour le moment</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {games.map((game) => (
            <li key={game.id}>
              <Link href={`/games/${game.id}`} className="px-4 py-2 border rounded hover:bg-gray-100 block">
                Jeu {game.id} - État : {game.state} - Joueurs : {game.session.players.length}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
