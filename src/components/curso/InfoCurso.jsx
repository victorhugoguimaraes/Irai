import { useContext, useState, useEffect } from 'react';
import { CursoContext } from '../../contexts/CursoContext';
import { useAuth } from '../../hooks/useAuth';
import { useUserData } from '../../hooks/useUserData';
import { Modal } from '../common/Modal';
import { InputField } from '../common/InputField';
import { useIRA } from '../../hooks/useIRA';

// Componente de exibição
export function InfoCurso() {
  const { user } = useAuth();
  const { cursoInfo, semestres, estatisticas } = useContext(CursoContext);
  const ira = useIRA(semestres);

  return (
    <div className="space-y-6">
      {/* Nome do Curso */}
      <div>
        <p className="text-sm font-medium text-gray-500">Curso</p>
        <p className="text-xl font-semibold text-gray-900">
          {cursoInfo.nome || 'Não informado'}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="border-b pb-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">IRA</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600">
              {ira ? ira.toFixed(3) : '0.000'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Disciplinas Cursadas</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {estatisticas.disciplinasCompletadas || 0}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Créditos Obtidos</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {estatisticas.creditosObtidos || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Carga Horária */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Carga Horária</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {cursoInfo.horasTotal || 0}h
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Obrigatórias</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {cursoInfo.horasObrigatorias || 0}h
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Optativas</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {cursoInfo.horasOptativas || 0}h
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Limite de Módulo Livre</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {cursoInfo.horasModuloLivre || 0}h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de edição
export function EditarInfoCurso({ onClose }) {
  const { cursoInfo, setCursoInfo } = useContext(CursoContext);
  const { user } = useAuth();
  const [userData, updateUserData] = useUserData(user?.uid);
  const [inputValues, setInputValues] = useState({
    nome: '',
    nomeUsuario: '',
    horasTotal: '',
    horasObrigatorias: '',
    horasOptativas: '',
    horasModuloLivre: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega os dados iniciais
  useEffect(() => {
    if (cursoInfo && userData) {
      setInputValues({
        nome: cursoInfo.nome || '',
        nomeUsuario: userData?.nomeUsuario || user?.displayName || '',
        horasTotal: cursoInfo.horasTotal > 0 ? cursoInfo.horasTotal.toString() : '',
        horasObrigatorias: cursoInfo.horasObrigatorias > 0 ? cursoInfo.horasObrigatorias.toString() : '',
        horasOptativas: cursoInfo.horasOptativas > 0 ? cursoInfo.horasOptativas.toString() : '',
        horasModuloLivre: cursoInfo.horasModuloLivre > 0 ? cursoInfo.horasModuloLivre.toString() : '',
      });
      setLoading(false);
    }
  }, [cursoInfo, userData, user]);

  const handleInputChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Salva informações do usuário
      await updateUserData({
        nomeUsuario: inputValues.nomeUsuario,
        lastUpdated: new Date().toISOString()
      });

      // Salva informações do curso
      await setCursoInfo({
        ...cursoInfo,
        nome: inputValues.nome,
        horasTotal: Number(inputValues.horasTotal) || 0,
        horasObrigatorias: Number(inputValues.horasObrigatorias) || 0,
        horasOptativas: Number(inputValues.horasOptativas) || 0,
        horasModuloLivre: Number(inputValues.horasModuloLivre) || 0,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Modal title="Editar Informações do Curso" onClose={onClose}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </Modal>
    );
  }

  const modalFooter = (
    <>
      <button
        onClick={onClose}
        disabled={saving}
        className="px-4 py-2 text-sm bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Salvando...
          </>
        ) : (
          'Salvar'
        )}
      </button>
    </>
  );

  return (
    <Modal title="Editar Informações do Curso" onClose={onClose} footer={modalFooter}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputField
            label="Seu Nome"
            value={inputValues.nomeUsuario}
            onChange={(value) => handleInputChange('nomeUsuario', value)}
            placeholder="Ex: João Silva"
          />
          
          <InputField
            label="Nome do Curso"
            value={inputValues.nome}
            onChange={(value) => handleInputChange('nome', value)}
            placeholder="Ex: Engenharia de Redes"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Carga Horária</h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Total de Horas"
              value={inputValues.horasTotal}
              onChange={(value) => handleInputChange('horasTotal', value)}
              type="number"
              placeholder="0"
              suffix="h"
            />
            
            <InputField
              label="Horas Obrigatórias"
              value={inputValues.horasObrigatorias}
              onChange={(value) => handleInputChange('horasObrigatorias', value)}
              type="number"
              placeholder="0"
              suffix="h"
            />
            
            <InputField
              label="Horas Optativas"
              value={inputValues.horasOptativas}
              onChange={(value) => handleInputChange('horasOptativas', value)}
              type="number"
              placeholder="0"
              suffix="h"
            />
            
            <InputField
              label="Limite Módulo Livre"
              value={inputValues.horasModuloLivre}
              onChange={(value) => handleInputChange('horasModuloLivre', value)}
              type="number"
              placeholder="0"
              suffix="h"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}