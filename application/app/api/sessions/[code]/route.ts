// Session by code API endpoint - GET → récupérer infos d'une session
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const gameSession = await prisma.gameSession.findUnique({
      where: { code: params.code.toUpperCase() },
        include: { players: true, host: true },
    });
    if (!gameSession) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }
    return NextResponse.json(gameSession);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
