import { useState, useEffect } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  };
} 