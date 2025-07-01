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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Catalogue des Livres</h1>
          <p className="text-gray-600">Découvrez notre collection de livres académiques</p>
        </div>
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtres de recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche par titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher par titre
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tapez le titre du livre..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Filtre par catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {/* Filtre par auteur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auteur
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponibles uniquement</span>
                </label>
              </div>
            </div>
          </div>
          {/* Bouton de reset */}
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedAuthor('');
                setShowAvailableOnly(false);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              🔄 Réinitialiser les filtres
            </button>
          </div>
        </div>
        {/* Statistiques */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>📖 Total: {books.length} livres</span>
            <span>✅ Disponibles: {books.filter(b => b.disponible).length}</span>
            <span>📚 Catégories: {categories.length}</span>
          </div>
        </div>
        {/* Liste des livres */}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
            {errorMsg}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des livres...</span>
          </div>
        ) : Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
              key={book.id} 
              {...book} 
              onBorrowSuccess={handleBorrowSuccess}
              />
            ))}
            </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun livre trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
