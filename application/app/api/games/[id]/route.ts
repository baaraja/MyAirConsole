import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id;

    const games = await prisma.game.findMany({
      where: { sessionId },
      select: {
        id: true,
        state: true,
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
