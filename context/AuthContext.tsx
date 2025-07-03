'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { nom: string; prenom: string; email: string; password: string; role: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/me', {
        headers: { token: authToken }
      });
      // Vérifie que la réponse est bien un utilisateur valide
      if (response.data && !response.data.error && !response.data.Error) {
        setUser(response.data);
      } else {
        // Si erreur, on force le logout
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      // Synchroniser le contexte utilisateur après login
      await fetchCurrentUser(newToken);
      // Redirection automatique selon le rôle
      if (userData.role && userData.role.toLowerCase() === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // @ts-ignore
        console.log('Erreur backend:', error.response.data);
      }
      return false;
    }
  };

  const register = async (userData: { nom: string; prenom: string; email: string; password: string; role: string }): Promise<boolean> => {
    try {
      // Ajout d'un champ telephone par défaut (optionnel, à adapter selon le backend)
      const payload = { ...userData, telephone: 0 };
      const response = await axios.post('http://localhost:4000/signup', payload);
      if (response.data && response.data.Error === false) {
        return true;
      } else {
        console.error('Erreur d\'inscription:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};