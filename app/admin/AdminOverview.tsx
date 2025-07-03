"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface Stats {
  totalLivres: number;
  totalEtudiants: number;
  totalEmprunts: number;
  empruntsEnCours: number;
  empruntsRetournes: number;
}

export default function AdminOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:4000/api/admin/stats", { headers: { token } })
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => { setError("Erreur de chargement des statistiques"); setLoading(false); });
  }, [token]);

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? <p>Chargement...</p> : error ? <p className="text-red-600">{error}</p> : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl mt-6">
          <div className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-400 to-blue-200 p-8 flex flex-col items-center hover:scale-105 transition">
            <span className="text-4xl font-extrabold text-white drop-shadow mb-2">{stats.totalLivres}</span>
            <span className="text-lg font-semibold text-white tracking-wide">Livres</span>
          </div>
          <div className="rounded-2xl shadow-xl bg-gradient-to-br from-green-400 to-green-200 p-8 flex flex-col items-center hover:scale-105 transition">
            <span className="text-4xl font-extrabold text-white drop-shadow mb-2">{stats.totalEtudiants}</span>
            <span className="text-lg font-semibold text-white tracking-wide">Étudiants</span>
          </div>
          <div className="rounded-2xl shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-200 p-8 flex flex-col items-center hover:scale-105 transition">
            <span className="text-4xl font-extrabold text-white drop-shadow mb-2">{stats.totalEmprunts}</span>
            <span className="text-lg font-semibold text-white tracking-wide">Emprunts</span>
          </div>
          <div className="rounded-2xl shadow-xl bg-gradient-to-br from-orange-400 to-orange-200 p-8 flex flex-col items-center hover:scale-105 transition">
            <span className="text-4xl font-extrabold text-white drop-shadow mb-2">{stats.empruntsEnCours}</span>
            <span className="text-lg font-semibold text-white tracking-wide">En cours</span>
          </div>
          <div className="rounded-2xl shadow-xl bg-gradient-to-br from-gray-400 to-gray-200 p-8 flex flex-col items-center hover:scale-105 transition">
            <span className="text-4xl font-extrabold text-white drop-shadow mb-2">{stats.empruntsRetournes}</span>
            <span className="text-lg font-semibold text-white tracking-wide">Retournés</span>
          </div>
        </div>
      )}
    </div>
  );
}
