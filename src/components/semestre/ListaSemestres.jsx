import { useContext } from 'react';
import { CursoContext } from '../../contexts/CursoContext';
import { Semestre } from './Semestre';
import { calcularIRASemestre } from '../../utils/calculosAcademicos';

export function ListaSemestres() {
  const { semestres = [], setSemestres } = useContext(CursoContext);

  const adicionarSemestre = () => {
    setSemestres([...semestres, {
      numero: semestres.length + 1,
      disciplinas: []
    }]);
  };

  const removerSemestre = (numeroSemestre) => {
    setSemestres(semestres.filter(semestre => semestre.numero !== numeroSemestre));
  };

  const adicionarDisciplina = (numeroSemestre, disciplina) => {
    setSemestres(semestres.map(semestre =>
      semestre.numero === numeroSemestre
        ? { ...semestre, disciplinas: [...semestre.disciplinas, disciplina] }
        : semestre
    ));
  };

  const removerDisciplina = (numeroSemestre, indexDisciplina) => {
    setSemestres(semestres.map(semestre =>
      semestre.numero === numeroSemestre
        ? {
            ...semestre,
            disciplinas: semestre.disciplinas.filter((_, index) => index !== indexDisciplina)
          }
        : semestre
    ));
  };

  return (
    <div className="space-y-4">
      <button
        data-action="adicionar-semestre"
        onClick={adicionarSemestre}
        className="hidden"
      />

      {Array.isArray(semestres) && semestres.map((semestre) => (
        <div key={semestre.numero} className="animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-gray-900">
                {semestre.numero}º Semestre
              </h2>
              <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="text-sm font-medium text-emerald-700">
                  IRA: {calcularIRASemestre(semestre.disciplinas || []).toFixed(4)}
                </span>
              </div>
            </div>
            {semestres.length > 1 && (
              <button
                onClick={() => removerSemestre(semestre.numero)}
                className="text-emerald-600 bg-white hover:bg-emerald-50 transition-colors p-2 rounded-lg border border-emerald-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <Semestre
            numero={semestre.numero}
            disciplinas={semestre.disciplinas || []}
            onAddDisciplina={adicionarDisciplina}
            onRemoveDisciplina={removerDisciplina}
          />
        </div>
      ))}
    </div>
  );
} 