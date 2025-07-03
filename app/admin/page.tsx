"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLivres from "./livres/AdminLivres";
import AdminEtudiants from "./utilisateurs/AdminEtudiants";
import AdminEmprunts from "./emprunts/AdminEmprunts";
import AdminOverview from "./AdminOverview";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'livres' | 'etudiants' | 'emprunts' | 'overview'>('overview');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/Connexion");
      } else if (!user.role || user.role.toLowerCase() !== "admin") {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <div style={{ color: "red" }}>Accès refusé. Veuillez vous reconnecter.<br/>user: {JSON.stringify(user)}</div>;
  }

  if (user.role && user.role.toLowerCase() === "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-2">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-0 md:p-8">
          {/* Navbar admin */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-blue-100 py-4 mb-8 bg-white rounded-t-xl">
            <button onClick={() => router.push('/')} className="px-4 py-2 font-semibold rounded transition bg-gray-200 text-gray-700 hover:bg-gray-300">Accueil</button>
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 font-semibold rounded transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>Vue d'ensemble</button>
            <button onClick={() => setActiveTab('livres')} className={`px-4 py-2 font-semibold rounded transition ${activeTab === 'livres' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>Gestion des livres</button>
            <button onClick={() => setActiveTab('etudiants')} className={`px-4 py-2 font-semibold rounded transition ${activeTab === 'etudiants' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>Gestion des étudiants</button>
            <button onClick={() => setActiveTab('emprunts')} className={`px-4 py-2 font-semibold rounded transition ${activeTab === 'emprunts' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>Emprunts</button>
          </nav>
          <div className="p-4 md:p-0">
            {activeTab === 'overview' && (
              <section className="animate-fade-in">
                <h1 className="text-3xl font-extrabold mb-4 text-blue-900 text-center">Tableau de bord Administrateur</h1>
                <p className="mb-8 text-gray-600 text-center">Bienvenue dans l'espace d'administration. Gérez les livres, les étudiants et les emprunts de la bibliothèque.</p>
                <AdminOverview />
              </section>
            )}
            {activeTab === 'livres' && (
              <section className="bg-gray-50 p-6 rounded-lg shadow-inner animate-fade-in">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Gestion des livres</h2>
                <AdminLivres />
              </section>
            )}
            {activeTab === 'etudiants' && (
              <section className="bg-gray-50 p-6 rounded-lg shadow-inner animate-fade-in">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Gestion des étudiants</h2>
                <AdminEtudiants />
              </section>
            )}
            {activeTab === 'emprunts' && (
              <section className="bg-gray-50 p-6 rounded-lg shadow-inner animate-fade-in">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Liste des emprunts</h2>
                <AdminEmprunts />
              </section>
            )}
          </div>
        </div>
        <style jsx global>{`
          .animate-fade-in {
            animation: fadeIn 0.4s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return <div style={{ color: "red" }}>Accès refusé. Vous n'avez pas les droits administrateur.</div>;
}
