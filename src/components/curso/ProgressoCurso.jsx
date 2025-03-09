import { useContext, useMemo } from 'react';
import { CursoContext } from '../../contexts/CursoContext';

export function ProgressoCurso() {
  const { cursoInfo, estatisticas } = useContext(CursoContext);

  const progresso = useMemo(() => {
    const calcularPorcentagem = (feitas, total) => {
      if (!total || total <= 0) return 0;
      return (feitas / total) * 100;
    };

    return {
      obrigatorias: {
        feitas: estatisticas.horasObrigatoriasFeitas,
        total: cursoInfo.horasObrigatorias,
        porcentagem: calcularPorcentagem(estatisticas.horasObrigatoriasFeitas, cursoInfo.horasObrigatorias)
      },
      optativas: {
        feitas: estatisticas.horasOptativasFeitas,
        total: cursoInfo.horasOptativas,
        porcentagem: calcularPorcentagem(estatisticas.horasOptativasFeitas, cursoInfo.horasOptativas)
      },
      moduloLivre: {
        feitas: estatisticas.horasModuloLivreFeitas,
        total: cursoInfo.horasModuloLivre,
        porcentagem: calcularPorcentagem(estatisticas.horasModuloLivreFeitas, cursoInfo.horasModuloLivre)
      },
      total: {
        feitas: estatisticas.horasObrigatoriasFeitas + estatisticas.horasOptativasFeitas + estatisticas.horasModuloLivreFeitas,
        total: cursoInfo.horasTotal,
        porcentagem: calcularPorcentagem(
          estatisticas.horasObrigatoriasFeitas + estatisticas.horasOptativasFeitas + estatisticas.horasModuloLivreFeitas,
          cursoInfo.horasTotal
        )
      }
    };
  }, [cursoInfo, estatisticas]);

  return (
    <div className="space-y-6 h-full flex flex-col justify-between py-2">
      <h3 className="text-lg font-medium text-gray-900">Progresso do Curso</h3>
      
      <div className="space-y-6 flex-grow">
        <div className="space-y-5">
          <ProgressBar 
            label="Obrigatórias" 
            percentage={progresso.obrigatorias.porcentagem}
            feitas={progresso.obrigatorias.feitas}
            total={progresso.obrigatorias.total}
            color="emerald"
          />
          <ProgressBar 
            label="Optativas" 
            percentage={progresso.optativas.porcentagem}
            feitas={progresso.optativas.feitas}
            total={progresso.optativas.total}
            color="blue"
          />
          <ProgressBar 
            label="Módulo Livre" 
            percentage={progresso.moduloLivre.porcentagem}
            feitas={progresso.moduloLivre.feitas}
            total={progresso.moduloLivre.total}
            color="purple"
          />
        </div>

        <div className="pt-6 border-t">
          <ProgressBar 
            label="Total do Curso" 
            percentage={progresso.total.porcentagem}
            feitas={progresso.total.feitas}
            total={progresso.total.total}
            color="gray"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, percentage, feitas, total, color, size = 'default' }) {
  const colors = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    gray: 'bg-gray-600'
  };

  const sizes = {
    default: 'h-2.5',
    lg: 'h-3'
  };

  // Garante que a porcentagem seja um número válido entre 0 e 100
  const width = Math.min(Math.max(isNaN(percentage) ? 0 : percentage, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-${size === 'lg' ? 'base' : 'sm'} font-medium text-gray-700`}>
            {label}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {feitas}h / {total}h
          </span>
        </div>
        <span className={`text-${size === 'lg' ? 'base' : 'sm'} font-medium text-gray-700`}>
          {width.toFixed(1)}%
        </span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}