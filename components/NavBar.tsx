'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-[#0C1E3C] text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link href="/" className="text-xl font-bold hover:text-yellow-400 transition">
        📚 Bibliothèque Universitaire
      </Link>
      
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link href="/Livres" className="hover:text-yellow-400 transition">
              Catalogue
            </Link>
            <Link href="/MonEspace" className="hover:text-yellow-400 transition">
              Mon Espace
            </Link>
            <span className="text-yellow-400">
              Bonjour, {user?.prenom}
            </span>
            <button 
              onClick={() => { logout(); window.location.href = '/Connexion'; }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/Livres" className="hover:text-yellow-400 transition">
              Catalogue
            </Link>
            <Link href="/Inscription" className="hover:text-yellow-400 transition">
              S'inscrire
            </Link>
            <Link 
              href="/Connexion" 
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Se connecter
            </Link>
            <button 
              onClick={() => { logout(); window.location.href = '/Connexion'; }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
