import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { nom, prenom, email, password } = await request.json();

    // Validation basique
    if (!nom || !prenom || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Simulation de vérification d'email existant
    const existingEmails = ['admin@ecole.ma', 'etudiant@ecole.ma'];
    if (existingEmails.includes(email)) {
      return NextResponse.json(
        { error: 'Cette adresse email est déjà utilisée' },
        { status: 409 }
      );
    }

    // Simulation de création d'utilisateur
    const newUserId = Math.random().toString(36).substring(2, 15);
    const token = `mock-jwt-token-${newUserId}-${Date.now()}`;

    const userData = {
      id: newUserId,
      email,
      nom,
      prenom,
      role: 'student'
    };

    return NextResponse.json({
      message: 'Inscription réussie',
      token,
      user: userData
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
