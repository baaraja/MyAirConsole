// Join session API endpoint - POST → rejoindre via code
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
    try {
        const session = await auth();
        const isUser = session?.user ? true : false;
        const generatedName = `Player${Math.floor(Math.random() * 1000)}`;
        const gameSession = await prisma.gameSession.findUnique({
            where: { code: params.code.toUpperCase() },
        });
        if (!gameSession) {
            return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
        }
        const player = await prisma.player.create({
            data: {
                name: isUser ? session?.user?.name || generatedName : generatedName,
                userId: isUser ? session?.user?.id : null,
                sessionId: gameSession.id,
            },
        });
        return NextResponse.json({ player, gameSession });
    } catch (error) {
        return NextResponse.json({ error: "Impossible de rejoindre la session" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { code: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const playerId = searchParams.get('playerId');
        if (!playerId) {
            return NextResponse.json({ error: "playerId requis" }, { status: 400 });
        }
        const player = await prisma.player.findUnique({ where: { id: playerId } });
        if (!player) {
            return NextResponse.json({ error: "Joueur non trouvé" }, { status: 404 });
        }
        await prisma.player.delete({ where: { id: playerId } });
        return NextResponse.json({ message: "Joueur supprimé" });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
