export interface Disciplina {
  nome: string;
  horas: number;
  nota: number;
  tipo: 'Obrigatória' | 'Optativa' | 'Módulo Livre';
  status: 'Cursando' | 'Aprovado' | 'Reprovado' | 'Trancado';
}

export interface Semestre {
  numero: number;
  disciplinas: Disciplina[];
}

export interface AtividadeComplementar {
  id: number;
  descricao: string;
  horas: number;
  tipo: 'Extensão' | 'Pesquisa' | 'Monitoria' | 'Estágio' | 'Outro';
}

export interface CursoInfo {
  nome: string;
  nomeUsuario: string;
  horasTotal: number;
  horasObrigatorias: number;
  horasOptativas: number;
  horasModuloLivre: number;
  horasExtras: number;
}

export interface CursoContextType {
  semestres: Semestre[];
  setSemestres: (semestres: Semestre[]) => void;
  cursoInfo: CursoInfo;
  setCursoInfo: (info: CursoInfo) => void;
  horasExtras: AtividadeComplementar[];
  setHorasExtras: (atividades: AtividadeComplementar[]) => void;
} 