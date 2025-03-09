import { useState, useContext } from 'react';
import { CursoContext } from '../../contexts/CursoContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { Modal } from '../common/Modal';
import { InputField } from '../common/InputField';

export function EditarCursoForm({ onClose }) {
  const { cursoInfo, setCursoInfo } = useContext(CursoContext);
  const { user } = useAuth();
  const [userData, updateUserData] = useUserData(user?.uid);
  const [inputValues, setInputValues] = useState({
    nome: cursoInfo.nome || '',
    nomeUsuario: userData?.nomeUsuario || user?.displayName || '',
    horasTotal: cursoInfo.horasTotal > 0 ? cursoInfo.horasTotal.toString() : '',
    horasObrigatorias: cursoInfo.horasObrigatorias > 0 ? cursoInfo.horasObrigatorias.toString() : '',
    horasOptativas: cursoInfo.horasOptativas > 0 ? cursoInfo.horasOptativas.toString() : '',
    horasModuloLivre: cursoInfo.horasModuloLivre > 0 ? cursoInfo.horasModuloLivre.toString() : '',
  });
  const [saving, setSaving] = useState(false);

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
      setCursoInfo({
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
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Salvar
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal title="Editar Informações do Curso" onClose={onClose} footer={modalFooter}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <InputField
            label="Seu Nome"
            value={inputValues.nomeUsuario}
            onChange={(value) => handleInputChange('nomeUsuario', value)}
            placeholder="Ex: João Silva"
            className="lg:col-span-2"
          />
          
          <InputField
            label="Nome do Curso"
            value={inputValues.nome}
            onChange={(value) => handleInputChange('nome', value)}
            placeholder="Ex: Engenharia de Redes"
            className="lg:col-span-2"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Carga Horária</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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