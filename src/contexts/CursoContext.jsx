import { createContext, useState, useEffect } from 'react';
import { useDataSync } from '../hooks/useDataSync';
import { useAuth } from '../hooks/useAuth';
import { calcularIRA } from '../utils/calculosAcademicos';

export const CursoContext = createContext({});

const initialCursoInfo = {
  nome: '',
  horasTotal: 0,
  horasObrigatorias: 0,
  horasOptativas: 0,
  horasModuloLivre: 0
};

const initialState = {
  semestres: [],
  horasExtras: [],
  cursoInfo: initialCursoInfo,
  estatisticas: {
    ira: 0,
    disciplinasCompletadas: 0,
    creditosObtidos: 0,
    horasObrigatoriasFeitas: 0,
    horasOptativasFeitas: 0,
    horasModuloLivreFeitas: 0
  }
};

const horasParaCreditos = (horas) => Math.floor(horas / 15);

export function CursoProvider({ children }) {
  const { user } = useAuth();
  const [data, updateData] = useDataSync(user?.uid, initialState);
  const [semestres, setSemestresState] = useState(data.semestres || []);
  const [horasExtras, setHorasExtrasState] = useState(data.horasExtras || []);
  const [cursoInfo, setCursoInfoState] = useState(data.cursoInfo || initialCursoInfo);
  const [estatisticas, setEstatisticas] = useState(data.estatisticas || initialState.estatisticas);

  // Atualiza o estado quando os dados são carregados
  useEffect(() => {
    setSemestresState(data.semestres || []);
    setHorasExtrasState(data.horasExtras || []);
    setCursoInfoState(data.cursoInfo || initialCursoInfo);
  }, [data]);

  // Calcula estatísticas quando os dados mudam
  useEffect(() => {
    const disciplinasAprovadas = semestres.flatMap(semestre =>
      semestre.disciplinas.filter(d => d.status === 'Aprovado')
    );

    const horasObrigatoriasFeitas = disciplinasAprovadas
      .filter(d => d.tipo === 'Obrigatória')
      .reduce((sum, d) => sum + (Number(d.horas) || 0), 0);

    const horasOptativasFeitas = disciplinasAprovadas
      .filter(d => d.tipo === 'Optativa')
      .reduce((sum, d) => sum + (Number(d.horas) || 0), 0);

    const horasModuloLivreFeitas = disciplinasAprovadas
      .filter(d => d.tipo === 'Módulo Livre')
      .reduce((sum, d) => sum + (Number(d.horas) || 0), 0);

    const novasEstatisticas = {
      ira: calcularIRA(semestres),
      disciplinasCompletadas: disciplinasAprovadas.length,
      creditosObtidos: disciplinasAprovadas.reduce((sum, d) => sum + horasParaCreditos(Number(d.horas) || 0), 0),
      horasObrigatoriasFeitas,
      horasOptativasFeitas,
      horasModuloLivreFeitas
    };

    setEstatisticas(novasEstatisticas);

    // Atualiza os dados no storage
    updateData({
      semestres,
      horasExtras,
      cursoInfo,
      estatisticas: novasEstatisticas
    });
  }, [semestres, horasExtras, cursoInfo]);

  const setSemestres = (newSemestres) => {
    setSemestresState(newSemestres);
  };

  const setHorasExtras = (newHorasExtras) => {
    setHorasExtrasState(newHorasExtras);
  };

  const setCursoInfo = (newInfo) => {
    setCursoInfoState(newInfo);
  };

  return (
    <CursoContext.Provider
      value={{
        semestres,
        setSemestres,
        horasExtras,
        setHorasExtras,
        cursoInfo,
        setCursoInfo,
        estatisticas
      }}
    >
      {children}
    </CursoContext.Provider>
  );
} 