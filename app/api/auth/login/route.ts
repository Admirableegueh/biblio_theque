import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Simulation d'une vérification d'utilisateur
    // Dans un vrai projet, vous interrogeriez votre base de données
    const mockUsers = [
      {
        id: '1',
        email: 'admin@ecole.ma',
        password: 'admin123',
        nom: 'Admin',
        prenom: 'Système',
        role: 'admin'
      },
      {
        id: '2',
        email: 'etudiant@ecole.ma',
        password: 'etudiant123',
        nom: 'Dupont',
        prenom: 'Jean',
        role: 'student'
      }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Simulation d'un token JWT (dans un vrai projet, utilisez une vraie librairie JWT)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    const userData = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role
    };

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
