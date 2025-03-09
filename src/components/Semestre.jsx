import React from 'react';
import { horasParaCreditos } from '../utils/calculoIRA';

const MENCOES = {
  SS: 5,
  MS: 4,
  MM: 3,
  MI: 2,
  II: 1,
  SR: 0
};

const TIPOS_DISCIPLINA = {
  OBRIGATORIA: 'Obrigatória',
  OPTATIVA: 'Optativa',
  MODULO_LIVRE: 'Módulo Livre'
};

const TURNOS = {
  DIURNO: 'Diurno',
  NOTURNO: 'Noturno'
};

const Semestre = ({ numero, disciplinas, onAddDisciplina, onRemoveDisciplina }) => {
  const [novaDisciplina, setNovaDisciplina] = React.useState({
    nome: '',
    mencao: '',
    horas: '',
    tipo: TIPOS_DISCIPLINA.OBRIGATORIA,
    turno: 'DIURNO'
  });

  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaDisciplina.nome && novaDisciplina.mencao && novaDisciplina.horas) {
      onAddDisciplina(numero, {
        ...novaDisciplina,
        horas: parseInt(novaDisciplina.horas),
        semestre: Math.min(numero, 6)
      });
      setNovaDisciplina({
        nome: '',
        mencao: '',
        horas: '',
        tipo: TIPOS_DISCIPLINA.OBRIGATORIA,
        turno: 'DIURNO'
      });
      setIsFormOpen(false);
    }
  };

  const getMencaoColor = (mencao) => {
    const colors = {
      SS: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      MS: 'bg-blue-100 text-blue-800 border-blue-200',
      MM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      MI: 'bg-orange-100 text-orange-800 border-orange-200',
      II: 'bg-red-100 text-red-800 border-red-200',
      SR: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[mencao] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
      {/* Botão Adicionar Disciplina */}
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className={`w-full py-3 px-4 flex items-center justify-center gap-2 transition-colors
                   ${isFormOpen 
                     ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100' 
                     : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="font-medium">Adicionar Disciplina</span>
      </button>

      {/* Formulário */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 border-b border-emerald-100 animate-fadeIn bg-emerald-50/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Nome da Disciplina"
                value={novaDisciplina.nome}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={novaDisciplina.mencao}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, mencao: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Menção</option>
                {Object.keys(MENCOES).map(mencao => (
                  <option key={mencao} value={mencao}>{mencao}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <input
                type="number"
                placeholder="Horas"
                min="15"
                step="15"
                value={novaDisciplina.horas}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, horas: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={novaDisciplina.turno}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, turno: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {Object.entries(TURNOS).map(([valor, texto]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={novaDisciplina.tipo}
                onChange={(e) => setNovaDisciplina({ ...novaDisciplina, tipo: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {Object.values(TIPOS_DISCIPLINA).map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 
                       hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                       transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Disciplinas */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50/50">
              <th className="px-4 py-3 text-left font-medium text-emerald-800">Disciplina</th>
              <th className="px-4 py-3 text-left font-medium text-emerald-800">Menção</th>
              <th className="px-4 py-3 text-left font-medium text-emerald-800">Horas</th>
              <th className="px-4 py-3 text-left font-medium text-emerald-800">Créditos</th>
              <th className="px-4 py-3 text-left font-medium text-emerald-800">Turno</th>
              <th className="px-4 py-3 text-left font-medium text-emerald-800">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-emerald-800 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {disciplinas.map((disciplina, index) => (
              <tr key={index} className="hover:bg-emerald-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{disciplina.nome}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getMencaoColor(disciplina.mencao)}`}>
                    {disciplina.mencao}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{disciplina.horas}h</td>
                <td className="px-4 py-3 text-gray-600">{horasParaCreditos(disciplina.horas, disciplina.turno)}</td>
                <td className="px-4 py-3 text-gray-600">{TURNOS[disciplina.turno]}</td>
                <td className="px-4 py-3 text-gray-600">{disciplina.tipo}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onRemoveDisciplina(numero, index)}
                    className="bg-white text-emerald-600 hover:text-emerald-700 transition-colors p-1.5 
                             border border-emerald-100 hover:border-emerald-200 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {disciplinas.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  Nenhuma disciplina adicionada neste semestre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Semestre; 