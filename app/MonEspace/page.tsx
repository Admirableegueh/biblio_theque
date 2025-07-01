"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  nom: string;
  prenom: string;
  email: string;
}

interface LivreEmprunte {
  id: number;
  titre: string;
  auteur: string;
  dateEmprunt: string;
  dateRetour: string;
}

export default function MonEspace() {
  const [user, setUser] = useState<User | null>(null);
  const [livres, setLivres] = useState<LivreEmprunte[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/connexion");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const livresResponse = await axios.get("http://localhost:5000/api/emprunts/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLivres(livresResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'espace perso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/connexion");
  };

  const retournerLivre = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:5000/api/retourner/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivres((prev) => prev.filter((livre) => livre.id !== id));
    } catch (err) {
      console.error("Erreur retour livre", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">👤 Mon Espace</h1>

      {user && (
        <div className="mb-8">
          <p><strong>Nom :</strong> {user.prenom} {user.nom}</p>
          <p><strong>Email :</strong> {user.email}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">📚 Livres empruntés</h2>
      {livres.length === 0 ? (
        <p>Vous n'avez aucun livre en cours d'emprunt.</p>
      ) : (
        <ul className="space-y-4">
          {livres.map((livre) => (
            <li key={livre.id} className="border p-4 rounded shadow-sm">
              <p><strong>Titre :</strong> {livre.titre}</p>
              <p><strong>Auteur :</strong> {livre.auteur}</p>
              <p><strong>Date d'emprunt :</strong> {new Date(livre.dateEmprunt).toLocaleDateString()}</p>
              <p><strong>Date de retour :</strong> {new Date(livre.dateRetour).toLocaleDateString()}</p>
              <button
                className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => retournerLivre(livre.id)}
              >
                Retourner
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-8">
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
          🔓 Se déconnecter
        </button>
      </div>
    </div>
  );
}
