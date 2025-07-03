'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface Book {
  id: number;
  titre: string;
  auteur: string;
  genre: string;
  disponible: boolean;
  quantite?: number;
  description?: string;
}

interface Review {
  id: number;
  userId: number;
  nom: string;
  prenom: string;
  note: number;
  commentaire: string;
  date: string;
}

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [bookError, setBookError] = useState(''); // Ajout pour erreur livre
  const [reviewsError, setReviewsError] = useState(''); // Ajout pour erreur avis

  useEffect(() => {
    if (id) {
      fetchBookDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    setBookError('');
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { headers: { token } } : {};
      const res = await axios.get(`http://localhost:4000/api/livres/${id}`, headers);
      setBook(res.data);
      if (!res.data || !res.data.id) {
        setBookError('Livre introuvable.');
      }
    } catch (error) {
      setBook(null);
      setBookError("Erreur lors du chargement du livre.");
    }
  };

  const fetchReviews = async () => {
    setReviewLoading(true);
    setReviewsError('');
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { headers: { token } } : {};
      const res = await axios.get(`http://localhost:4000/api/livres/${id}/avis`, headers);
      setReviews(res.data);
    } catch (error) {
      setReviews([]);
      setReviewsError("Erreur lors du chargement des avis.");
    }
    setReviewLoading(false);
  };

  const handleEmprunter = async () => {
    if (!book) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:4000/api/emprunter`, { livreId: id, userId: null }, { headers: { token } });
      alert('Livre emprunté avec succès !');
      fetchBookDetails();
    } catch (error) {
      alert('Erreur lors de la demande d\'emprunt');
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    const token = localStorage.getItem('token');
    if (!token) {
      setReviewError('Vous devez être connecté pour laisser un avis.');
      return;
    }
    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.user_id;
    } catch {
      setReviewError('Token invalide.');
      return;
    }
    if (!note) {
      setReviewError('Merci de donner une note.');
      return;
    }
    try {
      await axios.post(`http://localhost:4000/api/livres/${id}/avis`, { userId, note, commentaire }, { headers: { token } });
      setReviewSuccess('Avis enregistré !');
      setNote(0);
      setCommentaire('');
      fetchReviews();
    } catch {
      setReviewError('Erreur lors de l\'envoi de l\'avis.');
    }
  };

  const moyenne = reviews.length ? (reviews.reduce((acc, r) => acc + r.note, 0) / reviews.length).toFixed(2) : null;

  if (bookError) return <div className="p-8 text-red-600 font-bold">{bookError}</div>;
  if (!book) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      {/* Infos principales du livre */}
      <section className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">{book.titre}</h1>
        <p className="text-gray-700 mb-1"><span className="font-semibold">Auteur :</span> {book.auteur}</p>
        <p className="text-gray-700 mb-1"><span className="font-semibold">Catégorie :</span> {book.genre}</p>
        {typeof book.quantite === 'number' && <p className="text-gray-700 mb-1"><span className="font-semibold">Exemplaires disponibles :</span> {book.quantite}</p>}
        {book.description && (
          <p className="mt-2 text-gray-600"><span className="font-semibold">Description :</span> {book.description}</p>
        )}
        <p className={book.disponible ? 'text-green-600 mt-2' : 'text-red-600 mt-2'}>
          {book.disponible ? '✅ Disponible' : '❌ Indisponible'}
        </p>
        <button
          disabled={!book.disponible || loading}
          onClick={handleEmprunter}
          className={`mt-6 px-6 py-2 rounded text-white ${
            book.disponible
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Traitement...' : 'Emprunter'}
        </button>
      </section>

      {/* Note moyenne */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-2 text-yellow-700">Note moyenne</h2>
        {moyenne ? (
          <div className="flex items-center gap-2 text-yellow-600 text-2xl font-bold">
            {moyenne} / 5
            <span>★</span>
          </div>
        ) : (
          <div className="text-gray-500">Aucune note pour ce livre.</div>
        )}
      </section>

      {/* Liste des avis */}
      <section className="mb-8 border-b pb-6">
        <h2 className="text-xl font-bold mb-2 text-blue-800">Avis des étudiants</h2>
        {reviewLoading ? <div>Chargement...</div> : reviewsError ? <div className="text-red-600">{reviewsError}</div> : reviews.length === 0 ? <div className="text-gray-500">Aucun avis pour ce livre.</div> : (
          <ul className="space-y-4">
            {reviews.map(r => (
              <li key={r.id} className="bg-gray-50 rounded p-4 shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{r.prenom} {r.nom}</span>
                  <span className="text-yellow-600 font-bold">{r.note}★</span>
                  <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-700">{r.commentaire}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Formulaire d'avis */}
      <section>
        <h2 className="text-xl font-bold mb-2 text-blue-800">Laisser un avis</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Note</label>
            <select value={note} onChange={e => setNote(Number(e.target.value))} className="border rounded px-3 py-2">
              <option value={0}>Choisir une note</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Commentaire</label>
            <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)} className="border rounded px-3 py-2 w-full" rows={3} placeholder="Votre avis..." />
          </div>
          {reviewError && <div className="text-red-600 font-semibold">{reviewError}</div>}
          {reviewSuccess && <div className="text-green-600 font-semibold">{reviewSuccess}</div>}
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Envoyer</button>
        </form>
      </section>
    </div>
  );
}
