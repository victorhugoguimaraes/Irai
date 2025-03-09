import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export function useDataSync(userId, initialData = {}) {
  const [data, setData] = useState(() => {
    const localData = localStorage.getItem(`user_${userId}`);
    return localData ? JSON.parse(localData) : initialData;
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincroniza com localStorage
  useEffect(() => {
    localStorage.setItem(`user_${userId}`, JSON.stringify(data));
  }, [userId, data]);

  // Sincroniza com Firebase quando online
  useEffect(() => {
    if (!userId || !isOnline) return;

    const userDoc = doc(db, 'users', userId);
    
    // Escuta mudanças do Firebase
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const firebaseData = doc.data();
        const localData = JSON.parse(localStorage.getItem(`user_${userId}`) || '{}');
        
        // Compara timestamps para decidir qual dado usar
        if (firebaseData.lastUpdated > (localData.lastUpdated || 0)) {
          setData(firebaseData);
          localStorage.setItem(`user_${userId}`, JSON.stringify(firebaseData));
        }
      }
    });

    return () => unsubscribe();
  }, [userId, isOnline]);

  // Função para atualizar dados
  const updateData = async (newData) => {
    const timestamp = Date.now();
    const updatedData = { ...newData, lastUpdated: timestamp };
    
    // Atualiza estado e localStorage
    setData(updatedData);
    localStorage.setItem(`user_${userId}`, JSON.stringify(updatedData));

    // Tenta sincronizar com Firebase se online
    if (isOnline && userId) {
      try {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, updatedData, { merge: true });
      } catch (error) {
        console.error('Erro ao sincronizar com Firebase:', error);
      }
    }
  };

  return [data, updateData, isOnline];
} 