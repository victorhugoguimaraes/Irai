import { useState, useEffect } from 'react'
import Semestre from './components/Semestre'
import HorasExtras from './components/HorasExtras'
import { calcularIRA, calcularIRASemestre } from './utils'
import './App.css'

function App() {
  const [semestres, setSemestres] = useState([{ numero: 1, disciplinas: [] }])
  const [cursoInfo, setCursoInfo] = useState({
    nome: '',
    nomeUsuario: '',
    horasTotal: 0,
    horasObrigatorias: 0,
    horasOptativas: 0,
    horasModuloLivre: 0,
    horasExtras: 0
  })
  const [horasExtras, setHorasExtras] = useState([])
  const [isEditingCurso, setIsEditingCurso] = useState(false)
  const [inputValues, setInputValues] = useState({
    nome: '',
    nomeUsuario: '',
    horasTotal: '',
    horasObrigatorias: '',
    horasOptativas: '',
    horasModuloLivre: '',
    horasExtras: ''
  })

  // Carrega dados salvos quando o componente monta
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem('semestres')
      const infoSalva = localStorage.getItem('cursoInfo')
      const extrasSalvas = localStorage.getItem('horasExtras')

      if (dadosSalvos) {
        setSemestres(JSON.parse(dadosSalvos))
      }
      if (infoSalva) {
        const info = JSON.parse(infoSalva)
        setCursoInfo(info)
        setInputValues({
          nome: info.nome || '',
          nomeUsuario: info.nomeUsuario || '',
          horasTotal: info.horasTotal?.toString() || '',
          horasObrigatorias: info.horasObrigatorias?.toString() || '',
          horasOptativas: info.horasOptativas?.toString() || '',
          horasModuloLivre: info.horasModuloLivre?.toString() || '',
          horasExtras: ''
        })
      }
      if (extrasSalvas) {
        setHorasExtras(JSON.parse(extrasSalvas))
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }, [])

  // Salva alterações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('semestres', JSON.stringify(semestres))
      localStorage.setItem('cursoInfo', JSON.stringify(cursoInfo))
      localStorage.setItem('horasExtras', JSON.stringify(horasExtras))
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
    }
  }, [semestres, cursoInfo, horasExtras])

  const adicionarSemestre = () => {
    setSemestres([...semestres, {
      numero: semestres.length + 1,
      disciplinas: []
    }])
  }

  const adicionarDisciplina = (numeroSemestre, disciplina) => {
    setSemestres(semestres.map(semestre =>
      semestre.numero === numeroSemestre
        ? { ...semestre, disciplinas: [...semestre.disciplinas, disciplina] }
        : semestre
    ))
  }

  const removerDisciplina = (numeroSemestre, indexDisciplina) => {
    setSemestres(semestres.map(semestre =>
      semestre.numero === numeroSemestre
        ? {
            ...semestre,
            disciplinas: semestre.disciplinas.filter((_, index) => index !== indexDisciplina)
          }
        : semestre
    ))
  }

  const removerSemestre = (numeroSemestre) => {
    setSemestres(semestres.filter(semestre => semestre.numero !== numeroSemestre))
  }

  const iraTotal = calcularIRA(semestres)
  const totalDisciplinas = semestres.reduce((total, semestre) => 
    total + semestre.disciplinas.length, 0
  )
  const totalHoras = semestres.reduce((total, semestre) => 
    total + semestre.disciplinas.reduce((sum, disc) => sum + disc.horas, 0), 0
  )

  const handleInputChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = (field) => {
    const value = Number(inputValues[field]) || 0;
    setCursoInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCursoInfo = () => {
    const novoTotal = Number(inputValues.horasTotal) || 0;
    const novasObrigatorias = Number(inputValues.horasObrigatorias) || 0;
    const novasOptativas = Number(inputValues.horasOptativas) || 0;
    const novasModuloLivre = Number(inputValues.horasModuloLivre) || 0;

    setCursoInfo({
      nome: inputValues.nome,
      nomeUsuario: inputValues.nomeUsuario,
      horasTotal: novoTotal,
      horasObrigatorias: novasObrigatorias,
      horasOptativas: novasOptativas,
      horasModuloLivre: novasModuloLivre,
      horasExtras: 0
    });
    setIsEditingCurso(false);
  };

  // Cálculos de progresso
  const horasObrigatoriasFeitas = semestres.reduce((sum, semestre) => 
    sum + semestre.disciplinas
      .filter(d => d.tipo === 'Obrigatória')
      .reduce((sum, d) => sum + d.horas, 0), 0
  );

  const horasOptativasFeitas = semestres.reduce((sum, semestre) => 
    sum + semestre.disciplinas
      .filter(d => d.tipo === 'Optativa')
      .reduce((sum, d) => sum + d.horas, 0), 0
  );

  const horasModuloLivreFeitas = semestres.reduce((sum, semestre) => 
    sum + semestre.disciplinas
      .filter(d => d.tipo === 'Módulo Livre')
      .reduce((sum, d) => sum + d.horas, 0), 0
  );

  const adicionarHoraExtra = (novaHoraExtra) => {
    setHorasExtras([...horasExtras, {
      id: Date.now(),
      descricao: novaHoraExtra.descricao,
      horas: novaHoraExtra.horas,
      tipo: novaHoraExtra.tipo
    }])
  }

  const removerHoraExtra = (id) => {
    setHorasExtras(horasExtras.filter(hora => hora.id !== id))
  }

  const calcularIntegralizacao = () => {
    if (cursoInfo.horasTotal === 0) return 0;

    const horasObrigatoriasNecessarias = cursoInfo.horasObrigatorias;
    const horasOptativasNecessarias = cursoInfo.horasOptativas;
    
    const horasExtrasTotal = horasExtras.reduce((sum, extra) => sum + extra.horas, 0);
    const horasExtrasAproveitadas = Math.min(horasExtrasTotal, cursoInfo.horasTotal * 0.2);
    
    const horasObrigatoriasFeitas = semestres.reduce((sum, semestre) => 
      sum + semestre.disciplinas
        .filter(d => d.tipo === 'Obrigatória')
        .reduce((sum, d) => sum + d.horas, 0), 0
    );

    const horasOptativasFeitas = semestres.reduce((sum, semestre) => 
      sum + semestre.disciplinas
        .filter(d => d.tipo === 'Optativa')
        .reduce((sum, d) => sum + d.horas, 0), 0
    );

    const porcentagemObrigatorias = Math.min(horasObrigatoriasFeitas / horasObrigatoriasNecessarias * 100, 100) || 0;
    const porcentagemOptativas = Math.min((horasOptativasFeitas + horasExtrasAproveitadas) / horasOptativasNecessarias * 100, 100) || 0;
    
    const pesoObrigatorias = horasObrigatoriasNecessarias / cursoInfo.horasTotal;
    const pesoOptativas = horasOptativasNecessarias / cursoInfo.horasTotal;

    return (porcentagemObrigatorias * pesoObrigatorias + porcentagemOptativas * pesoOptativas);
  };

  const integralizacao = calcularIntegralizacao();

  const horasPendentesObrigatorias = Math.max(cursoInfo.horasObrigatorias - horasObrigatoriasFeitas, 0);
  const horasPendentesOptativas = Math.max(cursoInfo.horasOptativas - horasOptativasFeitas, 0);

  const horasPendentesModuloLivre = Math.max(cursoInfo.horasModuloLivre - horasModuloLivreFeitas, 0);
  const horasExcedentesModuloLivre = Math.max(horasModuloLivreFeitas - cursoInfo.horasModuloLivre, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 fixed top-0 left-0 right-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4">
            <h1 className="text-2xl font-bold text-emerald-600">
              Iraí
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Informações do Curso */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Informações do Curso</h2>
              {cursoInfo.nomeUsuario && (
                <p className="text-sm text-emerald-600 mt-1">Olá, {cursoInfo.nomeUsuario}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {!isEditingCurso && (
                <button
                  onClick={() => setIsEditingCurso(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-600 bg-white hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
          </div>
          
          {isEditingCurso ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={inputValues.nomeUsuario}
                    onChange={(e) => handleInputChange('nomeUsuario', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Curso
                  </label>
                  <input
                    type="text"
                    value={inputValues.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ex: Ciência da Computação"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total de Horas
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputValues.horasTotal}
                      onChange={(e) => handleInputChange('horasTotal', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Ex: 3000"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">h</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas Obrigatórias
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputValues.horasObrigatorias}
                      onChange={(e) => handleInputChange('horasObrigatorias', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Ex: 2400"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">h</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas Optativas
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputValues.horasOptativas}
                      onChange={(e) => handleInputChange('horasOptativas', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Ex: 600"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">h</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite Módulo Livre
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputValues.horasModuloLivre}
                      onChange={(e) => handleInputChange('horasModuloLivre', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Ex: 240"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setIsEditingCurso(false);
                    setInputValues({
                      nome: cursoInfo.nome,
                      nomeUsuario: cursoInfo.nomeUsuario,
                      horasTotal: cursoInfo.horasTotal.toString(),
                      horasObrigatorias: cursoInfo.horasObrigatorias.toString(),
                      horasOptativas: cursoInfo.horasOptativas.toString(),
                      horasModuloLivre: cursoInfo.horasModuloLivre.toString(),
                      horasExtras: ''
                    });
                  }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 
                           hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCursoInfo}
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                           transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Nome do Curso</h3>
                <p className="text-base text-gray-900">{cursoInfo.nome || "Não definido"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Horas</h3>
                <p className="text-base text-gray-900">{cursoInfo.horasTotal}h</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Horas Obrigatórias</h3>
                <p className="text-base text-gray-900">{cursoInfo.horasObrigatorias}h</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Horas Optativas</h3>
                <p className="text-base text-gray-900">{cursoInfo.horasOptativas}h</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Limite Módulo Livre</h3>
                <p className="text-base text-gray-900">{cursoInfo.horasModuloLivre}h</p>
              </div>
            </div>
          )}
        </div>

        {/* Card de Integralização */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Integralização</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Integralização Total</span>
                <span className="text-emerald-600 font-medium">{totalHoras}h / {cursoInfo.horasTotal}h ({integralizacao.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(integralizacao, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Horas Obrigatórias</span>
                <div className="text-right">
                  <span className="text-blue-600 font-medium">
                    {horasObrigatoriasFeitas}h / {cursoInfo.horasObrigatorias}h
                  </span>
                  {horasPendentesObrigatorias > 0 && (
                    <div className="text-red-500 text-xs">
                      Faltam {horasPendentesObrigatorias}h
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((horasObrigatoriasFeitas / cursoInfo.horasObrigatorias * 100) || 0, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Horas Optativas</span>
                <div className="text-right">
                  <span className="text-purple-600 font-medium">
                    {horasOptativasFeitas}h / {cursoInfo.horasOptativas}h
                  </span>
                  {horasPendentesOptativas > 0 && (
                    <div className="text-red-500 text-xs">
                      Faltam {horasPendentesOptativas}h
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((horasOptativasFeitas / cursoInfo.horasOptativas * 100) || 0, 100)}%` }}
                ></div>
              </div>
            </div>

            {(horasModuloLivreFeitas > 0 || cursoInfo.horasModuloLivre > 0) && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Módulo Livre</span>
                  <div className="text-right">
                    <span className={`font-medium ${horasExcedentesModuloLivre > 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {horasModuloLivreFeitas}h / {cursoInfo.horasModuloLivre}h
                    </span>
                    {horasExcedentesModuloLivre > 0 && (
                      <div className="text-red-500 text-xs">
                        Excedeu em {horasExcedentesModuloLivre}h
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${horasExcedentesModuloLivre > 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min((horasModuloLivreFeitas / cursoInfo.horasModuloLivre * 100) || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horas Extras */}
        <HorasExtras
          horasExtras={horasExtras}
          onAdicionar={adicionarHoraExtra}
          onRemover={removerHoraExtra}
        />

        {/* Semestres */}
        <div className="space-y-8">
          {semestres.map((semestre, index) => (
            <div key={semestre.numero} className="animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {semestre.numero}º Semestre
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                    <span className="text-sm font-medium text-emerald-700">
                      IRA: {calcularIRASemestre(semestre.disciplinas, semestre.numero).toFixed(4)}
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
                disciplinas={semestre.disciplinas}
                onAddDisciplina={adicionarDisciplina}
                onRemoveDisciplina={removerDisciplina}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={adicionarSemestre}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg 
                 hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 
                 focus:ring-offset-2 focus:ring-emerald-500 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="text-sm font-medium">Novo Semestre</span>
      </button>
    </div>
  )
}

export default App
