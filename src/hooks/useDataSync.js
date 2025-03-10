import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

export function useDataSync(userId, initialData = {}) {
  const [data, setData] = useState(initialData);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor de conexão
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

  // Carrega dados iniciais
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadInitialData = async () => {
      try {
        // Carrega dados do Firestore
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
          const firebaseData = docSnap.data();
          setData(firebaseData);
          localStorage.setItem(`user_${userId}`, JSON.stringify(firebaseData));
        } else {
          // Se não há dados no Firestore, usa o initialData
          setData(initialData);
          localStorage.setItem(`user_${userId}`, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Em caso de erro, tenta usar dados do localStorage
        const localData = localStorage.getItem(`user_${userId}`);
        if (localData) {
          setData(JSON.parse(localData));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();

    // Configura listener para atualizações em tempo real
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        const firebaseData = doc.data();
        setData(firebaseData);
        localStorage.setItem(`user_${userId}`, JSON.stringify(firebaseData));
      }
    }, (error) => {
      console.error('Erro no listener:', error);
    });

    return () => unsubscribe();
  }, [userId, initialData]);

  // Função para atualizar dados
  const updateData = async (newData) => {
    if (!userId) return;

    try {
      // Remove o lastUpdated se existir no newData
      const { lastUpdated, ...dataWithoutTimestamp } = newData;
      
      // Atualiza estado e localStorage
      setData(dataWithoutTimestamp);
      localStorage.setItem(`user_${userId}`, JSON.stringify(dataWithoutTimestamp));

      // Sincroniza com Firebase se online
      if (isOnline) {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, dataWithoutTimestamp, { merge: true });
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  return [data, updateData, isLoading];
} 