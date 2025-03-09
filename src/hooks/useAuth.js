import { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  createUserWithEmailAndPassword,
  signOut
} from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return result.user;
    } catch (error) {
      setError(
        error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? 'Email ou senha incorretos'
          : 'Ocorreu um erro ao fazer login'
      );
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      setError('Erro ao fazer login com Google');
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return result.user;
    } catch (error) {
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'Este email já está em uso'
          : 'Erro ao criar conta'
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError('Erro ao fazer logout');
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user
  };
} 