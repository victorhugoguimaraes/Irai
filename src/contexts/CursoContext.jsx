import { createContext, useState, useContext, useEffect } from 'react';
import { useDataSync } from '../hooks/useDataSync';
import { useAuth } from '../hooks/useAuth';
import { calcularIRA } from '../utils/calculosAcademicos';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

export function CursoProvider({ children }) {
  const { user } = useAuth();
  const [data, updateData, isLoading] = useDataSync(user?.uid, initialState);
  const [semestres, setSemestresState] = useState(data.semestres || []);
  const [horasExtras, setHorasExtrasState] = useState(data.horasExtras || []);
  const [cursoInfo, setCursoInfoState] = useState(data.cursoInfo || initialCursoInfo);
  const [estatisticas, setEstatisticas] = useState(data.estatisticas || initialState.estatisticas);
  const [disciplinas, setDisciplinas] = useState([]);
  const [moduloLivre, setModuloLivre] = useState([]);
  const [loading, setLoading] = useState(true);

  const horasNecessarias = {
    obrigatorias: 2640,
    optativas: 1110,
    moduloLivre: 360,
    total: 3750
  };

  const calcularProgresso = () => {
    // Calcula horas de disciplinas obrigatórias
    const horasObrigatorias = disciplinas
      .filter(d => d.tipo === 'obrigatoria' && d.concluida)
      .reduce((acc, d) => acc + d.cargaHoraria, 0);

    // Calcula horas de disciplinas optativas
    const horasOptativasDisciplinas = disciplinas
      .filter(d => d.tipo === 'optativa' && d.concluida)
      .reduce((acc, d) => acc + d.cargaHoraria, 0);

    // Soma das horas extras
    const totalHorasExtras = horasExtras
      .reduce((acc, h) => acc + Number(h.horas), 0);

    // Calcula horas do módulo livre
    const horasModuloLivre = moduloLivre
      .reduce((acc, m) => acc + Number(m.horas), 0);

    // Total de horas optativas (disciplinas + extras + módulo livre)
    const horasOptativasTotal = horasOptativasDisciplinas + totalHorasExtras + horasModuloLivre;

    // Calcula total geral
    const horasTotal = horasObrigatorias + horasOptativasTotal;

    // Calcula número de disciplinas cursadas e créditos
    const disciplinasCursadas = disciplinas.filter(d => d.concluida).length;
    const creditosObtidos = Math.floor(horasTotal / 15); // 1 crédito = 15 horas

    const horasCompletadas = {
      obrigatorias: horasObrigatorias,
      optativas: horasOptativasDisciplinas,
      horasExtras: totalHorasExtras,
      moduloLivre: horasModuloLivre,
      total: horasTotal
    };

    const progresso = {
      obrigatorias: (horasCompletadas.obrigatorias / horasNecessarias.obrigatorias) * 100,
      optativas: (horasOptativasTotal / horasNecessarias.optativas) * 100,
      horasExtras: (totalHorasExtras / horasNecessarias.optativas) * 100,
      moduloLivre: (horasModuloLivre / horasNecessarias.moduloLivre) * 100,
      total: (horasTotal / horasNecessarias.total) * 100,
      horasCompletadas,
      horasFaltantes: {
        obrigatorias: horasNecessarias.obrigatorias - horasCompletadas.obrigatorias,
        optativas: horasNecessarias.optativas - horasOptativasTotal,
        moduloLivre: horasNecessarias.moduloLivre - horasModuloLivre,
        total: horasNecessarias.total - horasTotal
      },
      disciplinasCursadas,
      creditosObtidos
    };

    return progresso;
  };

  const adicionarHoraExtra = async (horaExtra) => {
    const novasHorasExtras = [...horasExtras, horaExtra];
    setHorasExtrasState(novasHorasExtras);
    if (user?.uid !== 'anonimo') {
      await setDoc(doc(db, `usuarios/${user?.uid}/dados`, 'horasExtras'), {
        horas: novasHorasExtras
      });
    }
  };

  const removerHoraExtra = async (id) => {
    const novasHorasExtras = horasExtras.filter(hora => hora.id !== id);
    setHorasExtrasState(novasHorasExtras);
    if (user?.uid !== 'anonimo') {
      await setDoc(doc(db, `usuarios/${user?.uid}/dados`, 'horasExtras'), {
        horas: novasHorasExtras
      });
    }
  };

  const adicionarModuloLivre = async (atividade) => {
    const novoModuloLivre = [...moduloLivre, atividade];
    setModuloLivre(novoModuloLivre);
    if (user?.uid !== 'anonimo') {
      await setDoc(doc(db, `usuarios/${user?.uid}/dados`, 'moduloLivre'), {
        atividades: novoModuloLivre
      });
    }
  };

  const toggleDisciplina = async (codigo) => {
    const novasDisciplinas = disciplinas.map(d => {
      if (d.codigo === codigo) {
        return { ...d, concluida: !d.concluida };
      }
      return d;
    });
    
    setDisciplinas(novasDisciplinas);
    if (user?.uid !== 'anonimo') {
      await setDoc(doc(db, `usuarios/${user?.uid}/dados`, 'disciplinas'), {
        lista: novasDisciplinas
      });
    }
  };

  // Atualiza o estado quando os dados são carregados
  useEffect(() => {
    if (!isLoading && data) {
      setSemestresState(data.semestres || []);
      setHorasExtrasState(data.horasExtras || []);
      setCursoInfoState(data.cursoInfo || initialCursoInfo);
      setEstatisticas(data.estatisticas || initialState.estatisticas);
    }
  }, [data, isLoading]);

  // Calcula estatísticas quando os dados mudam
  useEffect(() => {
    if (isLoading) return;

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
      creditosObtidos: disciplinasAprovadas.reduce((sum, d) => sum + Math.floor((Number(d.horas) || 0) / 15), 0),
      horasObrigatoriasFeitas,
      horasOptativasFeitas,
      horasModuloLivreFeitas
    };

    setEstatisticas(novasEstatisticas);

    // Atualiza os dados no storage
    if (!isLoading) {
      updateData({
        semestres,
        horasExtras,
        cursoInfo,
        estatisticas: novasEstatisticas
      });
    }
  }, [semestres, horasExtras, cursoInfo, isLoading]);

  useEffect(() => {
    const carregarDados = async () => {
      if (user?.uid === 'anonimo') {
        const dadosLocalStorage = localStorage.getItem('dadosCurso');
        if (dadosLocalStorage) {
          const dados = JSON.parse(dadosLocalStorage);
          setDisciplinas(dados.disciplinas || []);
          setHorasExtrasState(dados.horasExtras || []);
          setModuloLivre(dados.moduloLivre || []);
        }
      } else {
        try {
          const disciplinasDoc = await getDoc(doc(db, `usuarios/${user?.uid}/dados`, 'disciplinas'));
          const horasExtrasDoc = await getDoc(doc(db, `usuarios/${user?.uid}/dados`, 'horasExtras'));
          const moduloLivreDoc = await getDoc(doc(db, `usuarios/${user?.uid}/dados`, 'moduloLivre'));

          setDisciplinas(disciplinasDoc.exists() ? disciplinasDoc.data().lista : []);
          setHorasExtrasState(horasExtrasDoc.exists() ? horasExtrasDoc.data().horas : []);
          setModuloLivre(moduloLivreDoc.exists() ? moduloLivreDoc.data().atividades : []);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      }
      setLoading(false);
    };

    carregarDados();
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid === 'anonimo') {
      localStorage.setItem('dadosCurso', JSON.stringify({
        disciplinas,
        horasExtras,
        moduloLivre
      }));
    }
  }, [disciplinas, horasExtras, moduloLivre, user?.uid]);

  const setSemestres = (newSemestres) => {
    setSemestresState(newSemestres);
  };

  const setHorasExtras = (newHorasExtras) => {
    setHorasExtrasState(newHorasExtras);
  };

  const setCursoInfo = (newInfo) => {
    setCursoInfoState(newInfo);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <CursoContext.Provider
      value={{
        semestres,
        setSemestres,
        horasExtras,
        setHorasExtras,
        cursoInfo,
        setCursoInfo,
        estatisticas,
        isLoading,
        disciplinas,
        toggleDisciplina,
        adicionarHoraExtra,
        removerHoraExtra,
        adicionarModuloLivre,
        calcularProgresso,
        horasNecessarias,
        loading
      }}
    >
      {children}
    </CursoContext.Provider>
  );
} 