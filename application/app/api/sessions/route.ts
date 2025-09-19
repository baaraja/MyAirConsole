// Sessions API endpoint - POST → créer une session
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
    return NextResponse.json(newSession);
    } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de la session" }, { status: 500 });
  }
}
