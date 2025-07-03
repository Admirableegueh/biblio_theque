"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Emprunt {
  id: number;
  userId: number;
  livreId: number;
  date_emprunt: string;
  date_retour?: string;
  titre: string;
  auteur: string;
  nom: string;
  prenom: string;
  email: string;
}

export default function AdminEmprunts() {
  const { token } = useAuth();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:4000/api/admin/emprunts", { headers: { token } })
      .then(res => { setEmprunts(res.data); setLoading(false); })
      .catch(() => { setError("Erreur de chargement des emprunts"); setLoading(false); });
  }, [token]);

  return (
    <div className="overflow-x-auto">
      {loading ? <p>Chargement...</p> : error ? <p className="text-red-600">{error}</p> : (
        <table className="w-full border rounded bg-white text-black shadow">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3">Étudiant</th>
              <th className="p-3">Email</th>
              <th className="p-3">Livre</th>
              <th className="p-3">Auteur</th>
              <th className="p-3">Date emprunt</th>
              <th className="p-3">Date retour</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">Aucun emprunt</td></tr>
            ) : (
              emprunts.map(e => (
                <tr key={e.id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3">{e.nom} {e.prenom}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">{e.titre}</td>
                  <td className="p-3">{e.auteur}</td>
                  <td className="p-3">{new Date(e.date_emprunt).toLocaleDateString()}</td>
                  <td className="p-3">{e.date_retour ? new Date(e.date_retour).toLocaleDateString() : '-'}</td>
                  <td className="p-3 font-semibold">{e.date_retour ? <span className="text-green-600">Retourné</span> : <span className="text-orange-500">En cours</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
