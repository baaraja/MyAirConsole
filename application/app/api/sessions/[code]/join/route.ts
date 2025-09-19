// Join session API endpoint - POST → rejoindre via code
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non connecté" }, { status: 401 });
        }
        const gameSession = await prisma.gameSession.findUnique({
            where: { code: params.code.toUpperCase() },
        });
        if (!gameSession) {
            return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
        }
        const player = await prisma.player.create({
            data: {
                name: session.user.name ?? "Invité",
                userId: session.user.id,
                sessionId: gameSession.id,
            },
        });
        return NextResponse.json({ player, gameSession });
    } catch (error) {
        return NextResponse.json({ error: "Impossible de rejoindre la session" }, { status: 500 });
    }
}
