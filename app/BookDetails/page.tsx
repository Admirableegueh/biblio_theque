'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  available: boolean;
  description?: string;
}

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      setBook(data);
    } catch (error) {
      console.error('Erreur chargement livre:', error);
    }
  };

  const handleEmprunter = async () => {
    if (!book) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // si tu gères l’auth
      const res = await fetch(`/api/books/${id}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert('Livre emprunté avec succès !');
        fetchBookDetails(); // actualise l’état du livre
      } else {
        alert(result.message || 'Erreur lors de l’emprunt');
      }
    } catch (error) {
      alert('Erreur lors de la demande d’emprunt');
      console.error(error);
    }
    setLoading(false);
  };

  if (!book) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="text-gray-700 mb-2">Auteur : {book.author}</p>
      <p className="text-gray-700 mb-2">Catégorie : {book.category}</p>
      <p className={book.available ? 'text-green-600' : 'text-red-600'}>
        {book.available ? '✅ Disponible' : '❌ Indisponible'}
      </p>
      {book.description && (
        <p className="mt-4 text-gray-600">Description : {book.description}</p>
      )}

      <button
        disabled={!book.available || loading}
        onClick={handleEmprunter}
        className={`mt-6 px-6 py-2 rounded text-white ${
          book.available
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Traitement...' : 'Emprunter'}
      </button>
    </div>
  );
}
