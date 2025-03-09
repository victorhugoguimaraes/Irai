import { useState, useContext } from 'react';
import { CursoContext } from '../../contexts/CursoContext';

export function HorasExtras() {
  const { horasExtras = [], setHorasExtras } = useContext(CursoContext);
  const [novaAtividade, setNovaAtividade] = useState({
    descricao: '',
    horas: '',
    tipo: 'Extensão'
  });

  const handleInputChange = (field, value) => {
    setNovaAtividade(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novaAtividade.descricao || !novaAtividade.horas) return;

    setHorasExtras([...horasExtras, {
      id: Date.now(),
      descricao: novaAtividade.descricao,
      horas: Number(novaAtividade.horas),
      tipo: novaAtividade.tipo
    }]);

    setNovaAtividade({
      descricao: '',
      horas: '',
      tipo: 'Extensão'
    });
  };

  const removerAtividade = (id) => {
    setHorasExtras(horasExtras.filter(hora => hora.id !== id));
  };

  const totalHoras = horasExtras.reduce((sum, atividade) => sum + (Number(atividade.horas) || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Atividades Complementares</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              Total: {totalHoras}h
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Atividade
            </label>
            <input
              type="text"
              value={novaAtividade.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ex: Participação em Projeto de Extensão"
            />
          </div>

          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas
            </label>
            <div className="relative">
              <input
                type="number"
                value={novaAtividade.horas}
                onChange={(e) => handleInputChange('horas', e.target.value)}
                className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="30"
                min="1"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">h</span>
              </div>
            </div>
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={novaAtividade.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="Extensão">Extensão</option>
              <option value="Pesquisa">Pesquisa</option>
              <option value="Monitoria">Monitoria</option>
              <option value="Estágio">Estágio</option>
              <option value="Curso">Curso</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium h-[38px] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar
          </button>
        </form>

        {Array.isArray(horasExtras) && horasExtras.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Horas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Tipo</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-emerald-800">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {horasExtras.map((atividade) => (
                  <tr key={atividade.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{atividade.descricao}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{atividade.horas}h</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{atividade.tipo}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removerAtividade(atividade.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 