"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import Link from "next/link";

interface Emprunt {
  id: number;
  livre_id: number;
  titre: string;
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour: string | null;
  statut: "En cours" | "Retourné" | "En retard";
}

export default function MesEmprunts() {
  const { token } = useAuth();
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEmprunts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:4000/api/mes-emprunts", {
        headers: { token },
        params: { userId: JSON.parse(atob(token.split('.')[1])).user_id }
      });
      console.log('Réponse API /api/mes-emprunts:', res.data);
      setEmprunts(res.data);
    } catch (err) {
      setError("Erreur lors du chargement de vos emprunts.");
      setEmprunts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEmprunts();
  }, [token]);

  const handleRetourner = async (empruntId: number) => {
    try {
      // On récupère l'emprunt pour avoir livre_id et user_id
      const emprunt = emprunts.find(e => e.id === empruntId);
      if (!emprunt) throw new Error('Emprunt introuvable');
      const userId = JSON.parse(atob(token.split('.')[1])).user_id;
      await axios.post(`http://localhost:4000/api/retourner`, { userId, livreId: emprunt.livre_id }, { headers: { token } });
      setSuccess("Livre retourné avec succès.");
      fetchEmprunts();
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Erreur lors du retour du livre.");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">📚 Mes Emprunts</h1>
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center font-semibold">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center font-semibold">{success}</div>}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            <span className="ml-4 text-blue-700 text-lg font-semibold">Chargement...</span>
          </div>
        ) : emprunts.length === 0 ? (
          <div className="text-center py-16 text-gray-600">Aucun emprunt en cours ou passé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl bg-white text-black shadow-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-900 text-lg">
                  <th className="p-4 text-left">Titre</th>
                  <th className="p-4 text-left">Date d'emprunt</th>
                  <th className="p-4 text-left">Date de retour prévue</th>
                  <th className="p-4 text-left">Date de retour effective</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {emprunts.map((emprunt) => (
                  <tr key={emprunt.id} className="border-t hover:bg-blue-50 transition text-base">
                    <td className="p-4 font-semibold align-middle">{emprunt.titre}</td>
                    <td className="p-4 align-middle">{new Date(emprunt.date_emprunt).toLocaleDateString()}</td>
                    <td className="p-4 align-middle">{new Date(emprunt.date_retour_prevue).toLocaleDateString()}</td>
                    <td className="p-4 align-middle">{emprunt.date_retour ? new Date(emprunt.date_retour).toLocaleDateString() : '-'}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        emprunt.statut === "En cours"
                          ? "bg-yellow-100 text-yellow-700"
                          : emprunt.statut === "Retourné"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {emprunt.statut}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-center">
                      {emprunt.statut === "En cours" && (
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
                          onClick={() => handleRetourner(emprunt.id)}
                        >
                          Retourner le livre
                        </button>
                      )}
                      {emprunt.statut === "Retourné" && (
                        <Link
                          href={`/BookDetails/${emprunt.livre_id}`}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
                        >
                          Laisser un avis
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
