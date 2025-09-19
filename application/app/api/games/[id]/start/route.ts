// Start game API endpoint - POST → démarrer une partie
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const sessionId = params.id;
        const game = await prisma.game.create({
            data: {
                sessionId,
                state: "waiting"
            }
        });
        return NextResponse.json(game);
    } catch (error) {
        return NextResponse.json({ error: "Impossible de démarrer le jeu" }, { status: 500 });
    }
}
