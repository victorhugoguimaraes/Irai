import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function useUserData(userId) {
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem(`userData_${userId}`);
    return savedData ? JSON.parse(savedData) : null;
  });

  // Carrega dados do usuário do Firebase quando o componente monta
  useEffect(() => {
    if (!userId) return;

    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
  }, [userId]);

  // Salva dados no Firebase e localStorage
  const updateUserData = async (newData) => {
    if (!userId) return;

    try {
      // Atualiza estado local
      setUserData(newData);
      
      // Salva no localStorage
      localStorage.setItem(`userData_${userId}`, JSON.stringify(newData));
      
      // Salva no Firebase
      await setDoc(doc(db, 'users', userId), newData, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  };

  return [userData, updateUserData];
} 