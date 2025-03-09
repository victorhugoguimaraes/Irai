import { useContext, useMemo } from 'react';
import { CursoContext } from '../contexts/CursoContext';
import { calcularIntegralizacao } from '../utils/calculosAcademicos';

export function useCursoCalculos() {
  const { cursoInfo, semestres, horasExtras } = useContext(CursoContext);

  const calculos = useMemo(() => {
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

    const horasModuloLivreFeitas = semestres.reduce((sum, semestre) => 
      sum + semestre.disciplinas
        .filter(d => d.tipo === 'Módulo Livre' && d.status === 'Aprovado')
        .reduce((sum, d) => sum + d.horas, 0), 0
    );

    const horasExtrasTotal = horasExtras.reduce((sum, extra) => sum + extra.horas, 0);
    const horasExtrasAproveitadas = Math.min(horasExtrasTotal, cursoInfo.horasTotal * 0.2);
    const horasModuloLivreAproveitadas = Math.min(horasModuloLivreFeitas, cursoInfo.horasModuloLivre || 0);

    const totalHorasOptativas = horasOptativasFeitas + horasModuloLivreAproveitadas + horasExtrasAproveitadas;
    const porcentagemObrigatorias = (horasObrigatoriasFeitas / (cursoInfo.horasObrigatorias || 1)) * 100;
    const porcentagemOptativas = (totalHorasOptativas / (cursoInfo.horasOptativas || 1)) * 100;
    const porcentagemModuloLivre = (horasModuloLivreFeitas / (cursoInfo.horasModuloLivre || 1)) * 100;

    const integralizacao = calcularIntegralizacao(cursoInfo, semestres, horasExtras);

    const materiasCursadas = semestres.reduce((acc, semestre) => {
      return acc + semestre.disciplinas.filter(d => d.status === 'Aprovado').length;
    }, 0);

    const ira = semestres.reduce((acc, semestre) => {
      const disciplinasAprovadas = semestre.disciplinas.filter(d => d.status === 'Aprovado');
      const somaNotas = disciplinasAprovadas.reduce((sum, d) => sum + (d.nota || 0), 0);
      return acc + (disciplinasAprovadas.length > 0 ? somaNotas / disciplinasAprovadas.length : 0);
    }, 0) / (semestres.length || 1);

    return {
      horasObrigatoriasFeitas,
      horasOptativasFeitas,
      horasModuloLivreFeitas,
      horasExtrasTotal,
      horasExtrasAproveitadas,
      horasModuloLivreAproveitadas,
      totalHorasOptativas,
      porcentagemObrigatorias,
      porcentagemOptativas,
      porcentagemModuloLivre,
      integralizacao,
      faltaObrigatorias: Math.max(0, cursoInfo.horasObrigatorias - horasObrigatoriasFeitas),
      faltaOptativas: Math.max(0, cursoInfo.horasOptativas - totalHorasOptativas),
      excedeModuloLivre: Math.max(0, horasModuloLivreFeitas - cursoInfo.horasModuloLivre),
      disponiveisModuloLivre: Math.max(0, cursoInfo.horasModuloLivre - horasModuloLivreFeitas),
      totalMateriasCursadas: materiasCursadas,
      ira
    };
  }, [cursoInfo, semestres, horasExtras]);

  return calculos;
} 