// components/BookCard.tsx
import Link from 'next/link';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

interface BookCardProps {
  id: number;
  titre: string;
  auteur: string;
  genre: string;
  disponible: boolean;
  quantite?: number;
  description?: string;
  annee_publication?: number;
  imageUrl?: string;
  onBorrowSuccess?: () => void;
}

export default function BookCard({ id, titre, auteur, genre, disponible, quantite, description, annee_publication, imageUrl, onBorrowSuccess }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{ nom: string; prenom: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour ouvrir la modale et récupérer les infos utilisateur
  const handleOpenModal = async () => {
    setError(null);
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || localStorage.getItem('access_token');
    }
    if (!token) {
      alert('Vous devez être connecté pour emprunter un livre.');
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      // Si le nom/prénom sont dans le token, on les prend, sinon on va les chercher
      if (decoded.nom && decoded.prenom) {
        setUserInfo({ nom: decoded.nom, prenom: decoded.prenom });
        setShowModal(true);
      } else {
        // Aller chercher les infos utilisateur via l'API
        setLoading(true);
        const res = await axios.get('http://localhost:4000/api/user/me', { headers: { token } });
        setUserInfo({ nom: res.data.nom, prenom: res.data.prenom });
        setShowModal(true);
        setLoading(false);
      }
    } catch (e: any) {
      setError('Impossible de récupérer les informations utilisateur.');
    }
  };

  // Fonction pour confirmer l'emprunt
  const handleBorrow = async () => {
    setLoading(true);
    setError(null);
    try {
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || localStorage.getItem('access_token');
      }
      if (!token) {
        alert('Vous devez être connecté pour emprunter un livre.');
        setLoading(false);
        return;
      }
      let userId = null;
      try {
        const decoded: any = jwtDecode(token);
        userId = decoded.user_id;
      } catch (e) {
        alert('Token invalide. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }
      if (!userId) {
        alert('Impossible de récupérer votre identifiant utilisateur.');
        setLoading(false);
        return;
      }
      await axios.post('http://localhost:4000/api/emprunter', { livreId: id, userId }, {
        headers: { token: token }
      });
      if (onBorrowSuccess) onBorrowSuccess();
      alert('Livre emprunté avec succès !');
      setShowModal(false);
    } catch (error: any) {
      setError('Erreur lors de l\'emprunt.');
      if (error?.response?.data?.message === 'jwt expired') {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
      } else if (error?.response?.data?.message === 'jwt malformed') {
        alert('Token invalide. Veuillez vous reconnecter.');
      } else if (error?.response?.data) {
        alert('Erreur lors de l\'emprunt du livre : ' + JSON.stringify(error.response.data));
      } else {
        alert('Erreur lors de l\'emprunt du livre. Connectez-vous ou réessayez.');
      }
    }
    setLoading(false);
  };

  // Dates
  const today = new Date();
  const dateEmprunt = today.toLocaleDateString();
  const dateRetour = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="p-4 border rounded shadow bg-white flex flex-col h-full">
      <img
        src={(!imageUrl || imageUrl.includes('exemple.com')) ? "/file.svg" : imageUrl}
        alt={titre}
        className="w-full h-40 object-cover rounded mb-3"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/file.svg";
        }}
      />
      <h2 className="text-xl font-semibold mb-1">{titre}</h2>
      <p className="text-gray-600 mb-1">Auteur : {auteur}</p>
      <p className="text-sm text-gray-500 mb-1">Catégorie : {genre}</p>
      {annee_publication && <p className="text-sm text-gray-400 mb-1">Année : {annee_publication}</p>}
      {description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>}
      <p className={disponible ? 'text-green-600 mb-1' : 'text-red-600 mb-1'}>
        {disponible ? '✅ Disponible' : '❌ Indisponible'}
      </p>
      {typeof quantite === 'number' && <p className="text-xs text-gray-400 mb-1">Quantité : {quantite}</p>}
      <button
        className="mt-auto inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
        disabled={!disponible || quantite === 0}
        onClick={handleOpenModal}
      >
        Emprunter
      </button>
      {/* Modal d'emprunt */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowModal(false)}>✕</button>
            <h3 className="text-lg font-bold mb-4">Récapitulatif de l'emprunt</h3>
            {loading ? (
              <p>Chargement...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="space-y-2">
                <div><span className="font-semibold">Nom de l'utilisateur :</span> {userInfo?.prenom} {userInfo?.nom}</div>
                <div><span className="font-semibold">Livre :</span> {titre}</div>
                <div><span className="font-semibold">Date d'emprunt :</span> {dateEmprunt}</div>
                <div><span className="font-semibold">Date de retour prévue :</span> {dateRetour}</div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-300" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleBorrow} disabled={loading || !!error}>
                Confirmer l'emprunt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
