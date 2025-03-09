import { useState } from 'react'

export default function HorasExtras({ horasExtras, onAdicionar, onRemover }) {
  const [novaHoraExtra, setNovaHoraExtra] = useState({
    descricao: '',
    horas: '',
    tipo: 'Curso'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!novaHoraExtra.descricao || !novaHoraExtra.horas) return

    onAdicionar({
      ...novaHoraExtra,
      horas: Number(novaHoraExtra.horas)
    })

    setNovaHoraExtra({
      descricao: '',
      horas: '',
      tipo: 'Curso'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Horas Extras</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <input
            type="text"
            value={novaHoraExtra.descricao}
            onChange={(e) => setNovaHoraExtra({ ...novaHoraExtra, descricao: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ex: Curso de Python"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horas
          </label>
          <input
            type="number"
            value={novaHoraExtra.horas}
            onChange={(e) => setNovaHoraExtra({ ...novaHoraExtra, horas: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ex: 30"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={novaHoraExtra.tipo}
            onChange={(e) => setNovaHoraExtra({ ...novaHoraExtra, tipo: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Curso">Curso</option>
            <option value="Aproveitamento">Aproveitamento</option>
            <option value="Atividade">Atividade Complementar</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Adicionar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {horasExtras.map((extra) => (
          <div
            key={extra.id}
            className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{extra.descricao}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>{extra.horas}h</span>
                <span>{extra.tipo}</span>
              </div>
            </div>
            <button
              onClick={() => onRemover(extra.id)}
              className="p-2 text-emerald-600 bg-white hover:bg-emerald-50 transition-colors rounded-lg border border-emerald-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 