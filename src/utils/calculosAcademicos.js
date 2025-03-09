export function calcularIRA(semestres) {
  let somaProdutos = 0;
  let somaHoras = 0;

  semestres.forEach(semestre => {
    semestre.disciplinas.forEach(disciplina => {
      if (disciplina.status === 'Aprovado' || disciplina.status === 'Reprovado') {
        somaProdutos += disciplina.nota * disciplina.horas;
        somaHoras += disciplina.horas;
      }
    });
  });

  return somaHoras === 0 ? 0 : somaProdutos / somaHoras;
}

export function calcularIRASemestre(disciplinas) {
  let somaProdutos = 0;
  let somaHoras = 0;

  disciplinas.forEach(disciplina => {
    if (disciplina.status === 'Aprovado' || disciplina.status === 'Reprovado') {
      somaProdutos += disciplina.nota * disciplina.horas;
      somaHoras += disciplina.horas;
    }
  });

  return somaHoras === 0 ? 0 : somaProdutos / somaHoras;
}

export function calcularIntegralizacao(cursoInfo, semestres, horasExtras) {
  if (cursoInfo.horasTotal === 0) return 0;

  const horasObrigatoriasNecessarias = cursoInfo.horasObrigatorias;
  const horasOptativasNecessarias = cursoInfo.horasOptativas;
  
  const horasExtrasTotal = horasExtras.reduce((sum, extra) => sum + extra.horas, 0);
  const horasExtrasAproveitadas = Math.min(horasExtrasTotal, cursoInfo.horasTotal * 0.2);
  
  const horasObrigatoriasFeitas = semestres.reduce((sum, semestre) => 
    sum + semestre.disciplinas
      .filter(d => d.tipo === 'Obrigatória' && d.status === 'Aprovado')
      .reduce((sum, d) => sum + d.horas, 0), 0
  );

  const horasOptativasFeitas = semestres.reduce((sum, semestre) => 
    sum + semestre.disciplinas
      .filter(d => d.tipo === 'Optativa' && d.status === 'Aprovado')
      .reduce((sum, d) => sum + d.horas, 0), 0
  );

  const porcentagemObrigatorias = Math.min(horasObrigatoriasFeitas / horasObrigatoriasNecessarias * 100, 100) || 0;
  const porcentagemOptativas = Math.min((horasOptativasFeitas + horasExtrasAproveitadas) / horasOptativasNecessarias * 100, 100) || 0;
  
  const pesoObrigatorias = horasObrigatoriasNecessarias / cursoInfo.horasTotal;
  const pesoOptativas = horasOptativasNecessarias / cursoInfo.horasTotal;

  return (porcentagemObrigatorias * pesoObrigatorias + porcentagemOptativas * pesoOptativas);
} 