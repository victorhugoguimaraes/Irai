import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState('login'); // 'login' ou 'cadastro'
  const { login, loginWithGoogle, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) return;
    
    setErro('');
    setCarregando(true);

    try {
      let user;
      if (modo === 'login') {
        user = await login(email, senha);
      } else {
        user = await register(email, senha);
      }
      
      onLogin({
        email: user.email,
        uid: user.uid,
        nome: user.displayName
      });
    } catch (error) {
      console.error(error);
      if (modo === 'login') {
        setErro('Email ou senha incorretos');
      } else {
        setErro(error.code === 'auth/email-already-in-use' 
          ? 'Este email já está em uso' 
          : 'Erro ao criar conta');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErro('');
    setCarregando(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        onLogin({
          email: user.email,
          uid: user.uid,
          nome: user.displayName
        });
      }
    } catch (error) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErro('Erro ao fazer login com Google');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleAnonimo = () => {
    localStorage.setItem('modo', 'anonimo');
    onLogin({ 
      email: 'anonimo@irai.app',
      uid: 'anonimo',
      nome: 'Anônimo'
    });
  };

  const toggleModo = () => {
    setModo(modo === 'login' ? 'cadastro' : 'login');
    setErro('');
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-green-800 to-green-900">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3m6.82 6L12 12.72L5.18 9L12 5.28L18.82 9M17 15.99l-5 2.73l-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
          <h1 className="mt-6 text-5xl font-bold text-white">Iraí</h1>
          <p className="mt-3 text-xl text-green-100/80">Gerenciador de Progresso Acadêmico</p>
        </div>

        {/* Card de Login/Cadastro */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {carregando ? 'Processando...' : modo === 'login' ? 'Entrar' : 'Criar Conta'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleModo}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                {modo === 'login' 
                  ? 'Não tem uma conta? Cadastre-se' 
                  : 'Já tem uma conta? Entre'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">ou</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <button
                onClick={handleGoogleLogin}
                disabled={carregando}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar com Google
              </button>

              <button
                onClick={handleAnonimo}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Continuar sem conta
              </button>
            </div>
          </div>

          {erro && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg text-center">
              {erro}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 