import { useState } from 'react';

export function Semestre({ numero, disciplinas, onAddDisciplina, onRemoveDisciplina }) {
  const [novaDisciplina, setNovaDisciplina] = useState({
    nome: '',
    horas: '',
    nota: '',
    tipo: 'Obrigatória',
    status: 'Cursando'
  });

  const handleInputChange = (field, value) => {
    setNovaDisciplina(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novaDisciplina.nome || !novaDisciplina.horas) return;

    onAddDisciplina(numero, {
      ...novaDisciplina,
      horas: Number(novaDisciplina.horas),
      nota: Number(novaDisciplina.nota) || 0
    });

    setNovaDisciplina({
      nome: '',
      horas: '',
      nota: '',
      tipo: 'Obrigatória',
      status: 'Cursando'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Disciplina
            </label>
            <input
              type="text"
              value={novaDisciplina.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ex: Cálculo 1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas
            </label>
            <div className="relative">
              <input
                type="number"
                value={novaDisciplina.horas}
                onChange={(e) => handleInputChange('horas', e.target.value)}
                className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="60"
                min="15"
                step="15"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">h</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={novaDisciplina.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="Obrigatória">Obrigatória</option>
              <option value="Optativa">Optativa</option>
              <option value="Módulo Livre">Módulo Livre</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={novaDisciplina.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="Cursando">Cursando</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Reprovado">Reprovado</option>
              <option value="Trancado">Trancado</option>
            </select>
          </div>

          {(novaDisciplina.status === 'Aprovado' || novaDisciplina.status === 'Reprovado') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menção
              </label>
              <select
                value={novaDisciplina.nota}
                onChange={(e) => handleInputChange('nota', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Selecione...</option>
                <option value="5">SS (5.0)</option>
                <option value="4">MS (4.0)</option>
                <option value="3">MM (3.0)</option>
                <option value="2">MI (2.0)</option>
                <option value="1">II (1.0)</option>
                <option value="0">SR (0.0)</option>
              </select>
            </div>
          )}

          <div className={`flex justify-end ${(novaDisciplina.status === 'Aprovado' || novaDisciplina.status === 'Reprovado') ? 'md:col-span-12' : 'md:col-span-2'}`}>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Adicionar Disciplina
            </button>
          </div>
        </form>

        {disciplinas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Disciplina</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Horas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-emerald-800">Menção</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-emerald-800">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {disciplinas.map((disciplina, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{disciplina.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{disciplina.horas}h</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{disciplina.tipo}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${disciplina.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                          disciplina.status === 'Reprovado' ? 'bg-red-100 text-red-800' :
                          disciplina.status === 'Cursando' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {disciplina.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {disciplina.nota ? ['SR', 'II', 'MI', 'MM', 'MS', 'SS'][disciplina.nota] : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onRemoveDisciplina(numero, index)}
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