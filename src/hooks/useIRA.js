import { useMemo } from 'react';

const MENCOES = {
  'SS': 5,
  'MS': 4,
  'MM': 3,
  'MI': 2,
  'II': 1,
  'SR': 0
};

export function useIRA(semestres) {
  return useMemo(() => {
    if (!semestres || semestres.length === 0) return 0;

    let numerador = 0;
    let denominador = 0;

    semestres.forEach((semestre, index) => {
      const semestreIndex = Math.min(index + 1, 6); // Limita o peso do semestre a 6
      
      semestre.disciplinas?.forEach(disciplina => {
        if (disciplina.mencao && disciplina.creditos) {
          const mencaoValor = MENCOES[disciplina.mencao] || 0;
          const creditos = Number(disciplina.creditos) || 0;
          
          numerador += mencaoValor * creditos * semestreIndex;
          denominador += creditos * semestreIndex;
        }
      });
    });

    if (denominador === 0) return 0;
    return numerador / denominador;
  }, [semestres]);
}

// Função auxiliar para calcular total de créditos
export function calcularTotalCreditos(semestres) {
  return semestres.reduce((total, semestre) => {
    return total + (semestre.disciplinas?.reduce((sum, disciplina) => {
      return sum + (Number(disciplina.creditos) || 0);
    }, 0) || 0);
  }, 0);
}

// Função auxiliar para calcular créditos cursados
export function calcularCreditosCursados(semestres) {
  return semestres.reduce((total, semestre) => {
    return total + (semestre.disciplinas?.reduce((sum, disciplina) => {
      return sum + (disciplina.mencao ? (Number(disciplina.creditos) || 0) : 0);
    }, 0) || 0);
  }, 0);
} 