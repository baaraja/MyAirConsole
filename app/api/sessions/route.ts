import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    const code = nanoid(6).toUpperCase();
    const newSession = await prisma.gameSession.create({
      data: {
        code,
        hostId: session.user.id,
      },
      include: { players: true },
    });
    // Création de 20 jeux pour test
    const gamesData = Array.from({ length: 20 }, (_, i) => ({
      state: i % 3 === 0 ? "En attente" : i % 3 === 1 ? "En cours" : "Terminé",
      sessionId: newSession.id,
    }));
    await prisma.game.createMany({
      data: gamesData,
    });
    return NextResponse.json(newSession);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création de la session" }, { status: 500 });
  }
}
