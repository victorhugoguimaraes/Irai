const MENCOES = {
  SS: 5,
  MS: 4,
  MM: 3,
  MI: 2,
  II: 1,
  SR: 0
};

// Função para converter horas em créditos
export const horasParaCreditos = (horas, turno = 'DIURNO') => {
  const minutosPorHora = turno === 'NOTURNO' ? 50 : 55;
  const horasAjustadas = (horas * minutosPorHora) / 60; // Converte para horas reais
  return Math.round(horasAjustadas / 15); // 1 crédito = 15 horas-aula
};

// Função para calcular o IRA
export const calcularIRA = (semestres) => {
  let numerador = 0;
  let denominador = 0;

  semestres.forEach(semestre => {
    semestre.disciplinas.forEach(disciplina => {
      const Ei = MENCOES[disciplina.mencao]; // Equivalência da menção
      const Cri = horasParaCreditos(disciplina.horas, disciplina.turno); // Converte horas em créditos
      const Sei = Math.min(disciplina.semestre, 6); // Semestre limitado a 6

      numerador += Ei * Cri * Sei;
      denominador += Cri * Sei;
    });
  });

  if (denominador === 0) return 0;

  return Number((numerador / denominador).toFixed(4));
};

// Função para calcular o IRA por semestre
export const calcularIRASemestre = (disciplinas, numeroSemestre) => {
  let numerador = 0;
  let denominador = 0;

  disciplinas.forEach(disciplina => {
    const Ei = MENCOES[disciplina.mencao];
    const Cri = horasParaCreditos(disciplina.horas, disciplina.turno);
    const Sei = Math.min(numeroSemestre, 6);

    numerador += Ei * Cri * Sei;
    denominador += Cri * Sei;
  });

  if (denominador === 0) return 0;

  return Number((numerador / denominador).toFixed(4));
}; 