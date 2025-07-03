'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import BookCard from '@/components/BookCard';
import axios from 'axios';

interface Book {
  id: number;
  titre: string;
  auteur: string;
  genre: string;
  disponible: boolean;
  quantite?: number;
  description?: string;
  annee_publication?: number;
  imageUrl?: string;
}

export default function Livres() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const params = new URLSearchParams();
      if (searchTerm) params.append('titre', searchTerm);
      if (selectedCategory) params.append('genre', selectedCategory);
      if (selectedAuthor) params.append('auteur', selectedAuthor);
      if (showAvailableOnly) params.append('disponible', '1');
      // Appel public, plus besoin de token
      const response = await axios.get(`http://localhost:4000/api/livres?${params.toString()}`);
      // Log détaillé de la réponse API pour debug
      console.log('Réponse API /api/livres:', response.data);
      if (!Array.isArray(response.data)) {
        console.error('La réponse de /api/livres n\'est pas un tableau:', response.data);
      }
      // Sécurise la récupération des livres
      const livres = Array.isArray(response.data) ? response.data : [];
      setBooks(livres);
      setFilteredBooks(livres);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
      setBooks([]);
      setFilteredBooks([]);
      setErrorMsg('Erreur lors du chargement des livres.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, selectedAuthor, showAvailableOnly]);

  // Obtenir toutes les catégories uniques
  const categories = [...new Set((books || []).map(book => book.genre))].sort();
  // Obtenir tous les auteurs uniques
  const authors = [...new Set((books || []).map(book => book.auteur))].sort();

  const handleBorrowSuccess = () => {
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100">
      <NavBar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 border-b-2 border-green-300 pb-6 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-green-800 mb-2 tracking-tight drop-shadow-lg">📚 Catalogue</h1>
          <p className="text-xl text-gray-600 font-medium">Explorez notre collection de livres académiques et laissez-vous inspirer !</p>
        </div>
        {/* Filtres */}
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 mb-12 border border-green-200 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><span className="text-3xl">🔎</span> Recherche & Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recherche par titre */}
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-2">Titre</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tapez le titre..."
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              />
            </div>
            {/* Filtre par catégorie */}
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {/* Filtre par auteur */}
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-2">Auteur</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              >
                <option value="">Tous les auteurs</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
            {/* Filtre disponibilité */}
            <div className="flex items-center">
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">Disponibilité</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-400 border-green-300 rounded"
                  />
                  <span className="ml-2 text-sm text-green-700">Disponibles uniquement</span>
                </label>
              </div>
            </div>
          </div>
          {/* Bouton de reset */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedAuthor('');
                setShowAvailableOnly(false);
              }}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow"
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>
        {/* Statistiques */}
        <div className="mb-8 flex flex-wrap gap-8 justify-center text-lg text-green-800 font-semibold">
          <span className="flex items-center gap-2"><span className="text-2xl">📖</span> {books.length} livres</span>
          <span className="flex items-center gap-2"><span className="text-2xl">✅</span> {books.filter(b => b.disponible).length} disponibles</span>
          <span className="flex items-center gap-2"><span className="text-2xl">📚</span> {categories.length} catégories</span>
        </div>
        {/* Liste des livres */}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center font-semibold">
            {errorMsg}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-green-600"></div>
            <span className="ml-4 text-green-700 text-lg font-semibold">Chargement des livres...</span>
          </div>
        ) : Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredBooks.map(book => (
              <div className="transition-transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl bg-white/90 border border-green-100" key={book.id}>
                <BookCard {...book} onBorrowSuccess={handleBorrowSuccess} />
              </div>
            ))}
            </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Aucun livre trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
