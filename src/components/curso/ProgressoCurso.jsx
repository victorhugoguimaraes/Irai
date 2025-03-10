import { useContext, useMemo } from 'react';
import { CursoContext } from '../../contexts/CursoContext';

export function ProgressoCurso() {
  const { cursoInfo, estatisticas, horasExtras } = useContext(CursoContext);

  const progresso = useMemo(() => {
    const calcularPorcentagem = (feitas, total) => {
      if (!total || total <= 0) return 0;
      return (feitas / total) * 100;
    };

    // Garante que todos os valores sejam números
    const horasObrigatorias = Number(estatisticas.horasObrigatoriasFeitas) || 0;
    const horasOptativas = Number(estatisticas.horasOptativasFeitas) || 0;
    const totalHorasExtras = Array.isArray(horasExtras) 
      ? horasExtras.reduce((sum, extra) => sum + Number(extra.horas), 0)
      : 0;
    const horasModuloLivre = Number(estatisticas.horasModuloLivreFeitas) || 0;

    // Soma todas as horas não obrigatórias
    const totalHorasNaoObrigatorias = horasOptativas + totalHorasExtras + horasModuloLivre;

    // Total geral de horas
    const horasTotal = horasObrigatorias + totalHorasNaoObrigatorias;

    const horasCompletadas = {
      obrigatorias: horasObrigatorias,
      optativas: totalHorasNaoObrigatorias, // Inclui optativas + extras + módulo livre
      horasExtras: totalHorasExtras,
      moduloLivre: horasModuloLivre,
      total: horasTotal
    };

    const horasFaltantes = {
      obrigatorias: Math.max(0, (cursoInfo.horasObrigatorias || 0) - horasObrigatorias),
      optativas: Math.max(0, (cursoInfo.horasOptativas || 0) - totalHorasNaoObrigatorias),
      moduloLivre: Math.max(0, (cursoInfo.horasModuloLivre || 0) - horasModuloLivre),
      total: Math.max(0, (cursoInfo.horasTotal || 0) - horasTotal)
    };

    return {
      obrigatorias: calcularPorcentagem(horasObrigatorias, cursoInfo.horasObrigatorias),
      optativas: calcularPorcentagem(totalHorasNaoObrigatorias, cursoInfo.horasOptativas),
      horasExtras: calcularPorcentagem(totalHorasExtras, cursoInfo.horasOptativas),
      moduloLivre: calcularPorcentagem(horasModuloLivre, cursoInfo.horasModuloLivre),
      total: calcularPorcentagem(horasTotal, cursoInfo.horasTotal),
      horasCompletadas,
      horasFaltantes
    };
  }, [cursoInfo, estatisticas, horasExtras]);

  const formatarProgresso = (valor) => {
    return valor.toFixed(1);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Progresso do Curso</h2>
      </div>

      <div className="space-y-4">
        {/* Disciplinas Obrigatórias */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Obrigatórias</span>
            <span className="text-sm font-medium text-gray-700">
              {formatarProgresso(progresso.obrigatorias)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(progresso.obrigatorias, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{progresso.horasCompletadas.obrigatorias}h / {cursoInfo.horasObrigatorias || 0}h</span>
            <span>Faltam: {progresso.horasFaltantes.obrigatorias}h</span>
          </div>
        </div>

        {/* Disciplinas Optativas */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Optativas</span>
            <span className="text-sm font-medium text-gray-700">
              {formatarProgresso(progresso.optativas)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${Math.min(progresso.optativas, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{progresso.horasCompletadas.optativas}h / {cursoInfo.horasOptativas || 0}h</span>
            <span>Faltam: {progresso.horasFaltantes.optativas}h</span>
          </div>
        </div>

        {/* Horas Extras */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Horas Extras</span>
            <span className="text-sm font-medium text-gray-700">
              {formatarProgresso(progresso.horasExtras)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${Math.min(progresso.horasExtras, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{progresso.horasCompletadas.horasExtras}h</span>
            <span>(Conta como optativa)</span>
          </div>
        </div>

        {/* Módulo Livre */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Módulo Livre</span>
            <span className="text-sm font-medium text-gray-700">
              {formatarProgresso(progresso.moduloLivre)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${Math.min(progresso.moduloLivre, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{progresso.horasCompletadas.moduloLivre}h / {cursoInfo.horasModuloLivre || 0}h</span>
            <span>Faltam: {progresso.horasFaltantes.moduloLivre}h</span>
          </div>
        </div>

        {/* Total do Curso */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Total do Curso</span>
            <span className="text-sm font-medium text-gray-700">
              {formatarProgresso(progresso.total)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${Math.min(progresso.total, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{progresso.horasCompletadas.total}h / {cursoInfo.horasTotal || 0}h</span>
            <span>Faltam: {progresso.horasFaltantes.total}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}