import { useState, useEffect, useContext } from 'react';
import { CursoProvider, CursoContext } from './contexts/CursoContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Section } from './components/layout/Section';
import { Card } from './components/common/Card';
import { InfoCurso, EditarInfoCurso } from './components/curso/InfoCurso';
import { ProgressoCurso } from './components/curso/ProgressoCurso';
import { EditarCursoForm } from './components/curso/EditarCursoForm';
import { ListaSemestres } from './components/semestre/ListaSemestres';
import { HorasExtras } from './components/horasExtras/HorasExtras';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { auth, signOut } from './config/firebase';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState('login');
  const [editandoCurso, setEditandoCurso] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario({
          email: user.email,
          uid: user.uid,
          nome: user.displayName
        });
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (dadosUsuario) => {
    setUsuario(dadosUsuario);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    if (pagina === 'cadastro') {
      return (
        <div className="auth-layout">
          <Cadastro 
            onLogin={handleLogin} 
            onVoltar={() => setPagina('login')} 
          />
        </div>
      );
    }
    return (
      <div className="auth-layout">
        <Login 
          onLogin={handleLogin} 
          onCriarConta={() => setPagina('cadastro')} 
        />
      </div>
    );
  }

  return (
    <AuthProvider>
      <CursoProvider>
        <AppContent 
          usuario={usuario} 
          onLogout={handleLogout} 
          editandoCurso={editandoCurso} 
          setEditandoCurso={setEditandoCurso} 
        />
      </CursoProvider>
    </AuthProvider>
  );
}

function AppContent({ usuario, onLogout, editandoCurso, setEditandoCurso }) {
  const { semestres } = useContext(CursoContext);

  return (
    <div className="content-layout">
      <Header usuario={usuario} onLogout={onLogout} className="header-fixed" />
      
      <main className="centered-container">
        <div className="content-wrapper animate-fadeIn">
          <div className="space-y-8">
            <Section 
              title="Informações do Curso"
              action={
                <button 
                  className="btn-primary"
                  onClick={() => setEditandoCurso(true)}
                >
                  Editar
                </button>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <InfoCurso />
                </Card>

                <Card>
                  <ProgressoCurso key={JSON.stringify(semestres)} />
                </Card>
              </div>
            </Section>
            
            <Section title="Semestres" 
              action={
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  onClick={() => document.querySelector('[data-action="adicionar-semestre"]')?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Adicionar Semestre
                </button>
              }
            >
              <ListaSemestres />
            </Section>
            
            <Section title="Horas Extras">
              <HorasExtras />
            </Section>
          </div>
        </div>
      </main>

      {editandoCurso && (
        <EditarInfoCurso onClose={() => setEditandoCurso(false)} />
      )}
    </div>
  );
}

export default App;
