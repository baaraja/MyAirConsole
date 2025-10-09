import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour effectuer cette action' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    console.log('Update role request:', { userId: session.user.id, newRole: role });

    // Valider le rôle
    if (!role || !['INVESTOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide. Doit être INVESTOR ou ADMIN' },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle de l'utilisateur (en utilisant une assertion de type)
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    console.log('User role updated successfully:', updatedUser);

    return NextResponse.json({
      user: updatedUser,
      message: 'Rôle mis à jour avec succès',
      sessionInvalidated: true,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du rôle' },
      { status: 500 }
    );
  }
}
