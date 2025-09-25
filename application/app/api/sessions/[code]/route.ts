// Session by code API endpoint - GET → récupérer infos d'une session, DELETE → supprimer la session
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

export async function DELETE(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé - connexion requise" }, { status: 401 });
    }

    const gameSession = await prisma.gameSession.findUnique({
      where: { code: params.code.toUpperCase() },
      include: { host: true },
    });
    
    if (!gameSession) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }

    // Vérifier que l'utilisateur connecté est bien l'host de la session
    if (gameSession.hostId !== session.user.id) {
      return NextResponse.json({ 
        error: "Non autorisé - seul l'hôte peut supprimer la session" 
      }, { status: 403 });
    }

    // Supprimer la session (CASCADE supprimera automatiquement les players et games)
    await prisma.gameSession.delete({
      where: { code: params.code.toUpperCase() },
    });

    return NextResponse.json({ message: "Session supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
