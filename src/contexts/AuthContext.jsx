import { createContext, useContext } from 'react';
import { useAuth as useFirebaseAuth } from '../hooks/useAuth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();

  return (
    <AuthContext.Provider value={auth}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 