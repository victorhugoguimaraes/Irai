import { useMemo } from 'react';

// Mapeamento de valor numérico para menção
const VALOR_PARA_MENCAO = {
  5: 'SS',
  4: 'MS',
  3: 'MM',
  2: 'MI',
  1: 'II',
  0: 'SR'
};

export function useIRA(semestres) {
  return useMemo(() => {
    if (!semestres || semestres.length === 0) return 0;

    let numerador = 0;
    let denominador = 0;

    semestres.forEach((semestre, index) => {
      const pesoSemestre = Math.min(index + 1, 6);
      
      semestre.disciplinas?.forEach(disciplina => {
        if (disciplina.status === 'CUMP' || disciplina.nota === undefined || disciplina.nota === '') {
          return;
        }

        const mencaoValor = Number(disciplina.nota);
        const creditos = Math.floor(Number(disciplina.horas) / 15);

        if (!isNaN(mencaoValor) && creditos > 0) {
          const contribuicao = mencaoValor * creditos * pesoSemestre;
          numerador += contribuicao;
          denominador += creditos * pesoSemestre;
        }
      });
    });

    if (denominador === 0) return 0;
    
    const ira = Number((numerador / denominador).toFixed(3));
    return ira;
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
      return sum + (disciplina.status === 'APR' ? (Number(disciplina.creditos) || 0) : 0);
    }, 0) || 0);
  }, 0);
} 