"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface Emprunt {
  id: number;
  livreId: number;
  titre: string;
  auteur: string;
  date_emprunt: string;
  date_retour: string | null;
  nom: string;
  prenom: string;
}

export default function MesEmprunts() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || localStorage.getItem("access_token");
    }
    if (!token) {
      setError("Vous devez être connecté pour voir vos emprunts.");
      setLoading(false);
      return;
    }
    let userId = null;
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.user_id;
    } catch (e) {
      setError("Token invalide. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }
    if (!userId) {
      setError("Impossible de récupérer votre identifiant utilisateur.");
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:4000/api/mes-emprunts?userId=${userId}`, {
        headers: { token: token },
      })
      .then((res) => {
        setEmprunts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des emprunts.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Mes Emprunts</h1>
      {emprunts.length === 0 ? (
        <div className="text-center text-gray-500">Aucun emprunt trouvé.</div>
      ) : (
        <table className="w-full border rounded shadow bg-white text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Titre</th>
              <th className="p-2">Auteur</th>
              <th className="p-2">Date d'emprunt</th>
              <th className="p-2">Date de retour</th>
              <th className="p-2">Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.titre}</td>
                <td className="p-2">{e.auteur}</td>
                <td className="p-2">{e.date_emprunt ? new Date(e.date_emprunt).toLocaleString() : "-"}</td>
                <td className="p-2">{e.date_retour ? new Date(e.date_retour).toLocaleString() : <span className="text-green-600">En cours</span>}</td>
                <td className="p-2">{e.prenom} {e.nom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
