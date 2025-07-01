'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// Composant Témoignages avec défilement automatique et effet fondu amélioré
function Testimonials() {
  const testimonials = [
    {
      text: "Une plateforme intuitive, rapide et très pratique pour mes emprunts.",
      author: "Aïssata, Étudiante en L3",
      avatar: "👩🏾‍🎓"
    },
    {
      text: "J'adore pouvoir réserver mes livres en ligne facilement.",
      author: "Karim, Étudiant en Master",
      avatar: "👨🏽‍🎓"
    },
    {
      text: "Le suivi des emprunts est clair et simple à utiliser.",
      author: "Fatou, Étudiante en Licence",
      avatar: "👩🏿‍🎓"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const { text, author, avatar } = testimonials[currentIndex];

  return (
    <section
      aria-label="Témoignages des étudiants"
      className="mt-24 max-w-4xl mx-auto text-center"
    >
      <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
        Ce que disent nos étudiants
      </h2>
      <div className="relative">
        <div
          className={`bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl transition-all duration-300 ${
            fade ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <div className="text-5xl mb-4">{avatar}</div>
          <p className="italic text-gray-100 text-xl leading-relaxed mb-4">"{text}"</p>
          <p className="text-yellow-400 font-semibold">— {author}</p>
        </div>
        
        {/* Indicateurs */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-yellow-400' : 'bg-white/30'
              }`}
              aria-label={`Témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Composant "Nouveautés" avec slider horizontal amélioré
function NewArrivals() {
  const [hoveredBook, setHoveredBook] = useState(null);
  
  const books = [
    { id: 1, title: "La Nuit des Temps", author: "René Barjavel", category: "Science-Fiction", rating: 4.8 },
    { id: 2, title: "L'Étranger", author: "Albert Camus", category: "Littérature", rating: 4.6 },
    { id: 3, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", category: "Classique", rating: 4.9 },
    { id: 4, title: "1984", author: "George Orwell", category: "Dystopie", rating: 4.7 },
    { id: 5, title: "Fahrenheit 451", author: "Ray Bradbury", category: "Science-Fiction", rating: 4.5 },
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'}`}>
            ⭐
          </span>
        ))}
        <span className="text-xs text-gray-300 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <section
      aria-label="Nouveautés en bibliothèque"
      className="my-20 max-w-6xl mx-auto px-4"
    >
      <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 text-center">
        Dernières Acquisitions
      </h2>
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-yellow-400/60 scrollbar-track-transparent">
        {books.map((book) => (
          <div
            key={book.id}
            className="min-w-[200px] group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300 cursor-pointer flex-shrink-0 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
            tabIndex={0}
            role="button"
            aria-label={`Livre: ${book.title} par ${book.author}`}
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            {/* Badge "Nouveau" */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              NOUVEAU
            </div>
            
            <div className="w-full h-48 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-yellow-400/30 group-hover:to-orange-400/30 transition-colors relative overflow-hidden">
              <span className="text-4xl group-hover:scale-110 transition-transform">📖</span>
              {/* Effet de brillance au hover */}
              {hoveredBook === book.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-shimmer"></div>
              )}
            </div>
            
            <StarRating rating={book.rating} />
            
            <div className="text-xs text-yellow-400 font-semibold mb-2 uppercase tracking-wide">
              {book.category}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
              {book.author}
            </p>
            
            {/* Bouton "Voir plus" qui apparaît au hover */}
            <div className={`mt-3 transition-all duration-300 ${hoveredBook === book.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <button className="w-full py-2 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-lg text-yellow-400 text-sm font-semibold border border-yellow-400/30 transition-colors">
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Composant Hero Section amélioré
function HeroSection({ isAuthenticated, isLoading }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
      {/* Particules flottantes qui suivent la souris */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse transition-all duration-1000"
          style={{
            left: `${20 + mousePos.x * 0.01}%`,
            top: `${25 + mousePos.y * 0.01}%`
          }}
        ></div>
        <div 
          className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping transition-all duration-700"
          style={{
            right: `${30 + mousePos.x * 0.005}%`,
            top: `${33 + mousePos.y * 0.008}%`
          }}
        ></div>
        <div 
          className="absolute w-3 h-3 bg-orange-400/20 rounded-full animate-bounce transition-all duration-500"
          style={{
            left: `${33 + mousePos.x * 0.008}%`,
            bottom: `${25 + mousePos.y * 0.005}%`
          }}
        ></div>
      </div>

      {/* Emoji animé avec effet brillant et hover */}
      <div className="relative mb-8 group cursor-pointer">
        <div className="text-8xl animate-bounce filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">📚</div>
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse group-hover:from-yellow-400/40 group-hover:to-orange-400/40 transition-all duration-300"></div>
      </div>

      <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
          Votre Bibliothèque
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse">
          Réinventée
        </span>
      </h1>

      <p className="text-xl md:text-2xl max-w-4xl mb-12 text-gray-200 leading-relaxed font-light">
        Découvrez une nouvelle façon de gérer vos lectures avec notre plateforme moderne et intuitive. 
        <br className="hidden md:block" />
        <span className="text-yellow-400 font-semibold">Réservez, empruntez, explorez</span> - tout en un clic.
      </p>

      {/* Boutons avec animations */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link
            href="/Livres"
            className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xl rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl"
            aria-label="Explorer le catalogue des livres"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
              Explorer le Catalogue
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>

          {isAuthenticated ? (
            <Link
              href="/MonEspace"
              className="group px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              aria-label="Accéder à mon espace utilisateur"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
                Mon Espace
              </span>
            </Link>
          ) : (
            <Link
              href="/Connexion"
              className="group px-10 py-5 bg-transparent border-3 border-yellow-400 text-yellow-400 font-bold text-xl rounded-2xl hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-2xl backdrop-blur-sm"
              aria-label="Se connecter à mon compte"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">🔐</span>
                Se Connecter
              </span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

// Composant Statistiques amélioré
function Statistics() {
  const stats = [
    { icon: '📚', value: '3,000+', label: 'Livres Disponibles', color: 'from-blue-400 to-blue-600' },
    { icon: '🎓', value: '200+', label: 'Étudiants Actifs', color: 'from-green-400 to-green-600' },
    { icon: '⚡', value: '24/7', label: 'Accès en Ligne', color: 'from-yellow-400 to-orange-400' },
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            tabIndex={0}
            aria-label={`${stat.value} ${stat.label}`}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              {stat.icon}
            </div>
            <p className={`text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-gray-300 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Composant Comment ça marche
function HowItWorks() {
  const steps = [
    { 
      icon: '🔍', 
      title: 'Recherchez', 
      desc: 'Parcourez notre catalogue enrichi avec des filtres avancés.',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      icon: '📅', 
      title: 'Réservez', 
      desc: 'Réservez instantanément vos livres préférés en ligne.',
      color: 'from-green-400 to-green-600'
    },
    { 
      icon: '📖', 
      title: 'Profitez', 
      desc: 'Récupérez et savourez vos lectures dans le confort.',
      color: 'from-yellow-400 to-orange-400'
    },
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-4">
      <h2 className="text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
        Comment ça marche ?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, index) => (
          <div key={index} className="text-center group">
            <div className="relative mb-6">
              <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                {index + 1}
              </div>
              <div className="absolute -top-2 -right-2 text-4xl group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors">
              {step.title}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/40 to-black/60"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 rounded-full filter blur-2xl animate-ping delay-2000"></div>
      </div>

      {/* CSS pour les animations personnalisées */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thumb-yellow-400\/60::-webkit-scrollbar-thumb {
          background-color: rgba(251, 191, 36, 0.6);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>

      {/* Contenu principal */}
      <div className="relative z-10">
        <NavBar />

        <main className="max-w-7xl mx-auto w-full">
          <HeroSection isAuthenticated={isAuthenticated} isLoading={isLoading} />
          <Statistics />
          <HowItWorks />
          <Testimonials />
          <NewArrivals />

          {/* Appel à l'action final */}
          <section className="py-20 text-center relative">
            <div className="max-w-4xl mx-auto px-4">
              {/* Effet de typing animation */}
              <div className="mb-6">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Prêt à commencer votre
                </h2>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mt-2">
                  aventure littéraire ?
                  <span className="animate-pulse">|</span>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Rejoignez des centaines d'étudiants qui ont déjà transformé leur façon de lire
              </p>
              
              {/* Bouton avec effet de pulsation */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-xl animate-pulse opacity-60"></div>
                <Link
                  href="/Livres"
                  className="relative group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-black rounded-2xl font-bold text-2xl hover:scale-110 transition-all duration-300 shadow-2xl"
                  aria-label="Explorer maintenant le catalogue de livres"
                >
                  <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🚀</span>
                  Explorer Maintenant
                  <span className="text-3xl group-hover:translate-x-2 transition-transform duration-300">✨</span>
                </Link>
              </div>
              
              {/* Petite indication subtile */}
              <p className="text-sm text-gray-400 mt-4 animate-bounce">
                ↓ Défilez pour découvrir plus ↓
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Bibliothèque Universitaire. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}