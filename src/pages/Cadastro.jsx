import { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from '../config/firebase';

export function Cadastro({ onLogin, onVoltar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);

    try {
      const resultado = await createUserWithEmailAndPassword(auth, email, senha);
      onLogin({
        email: resultado.user.email,
        uid: resultado.user.uid,
        nome: resultado.user.displayName
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setErro('Este email já está em uso');
      } else {
        setErro('Erro ao criar conta');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3m6.82 6L12 12.72L5.18 9L12 5.28L18.82 9M17 15.99l-5 2.73l-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
          <h1 className="text-4xl font-bold text-white mb-2">Iraí</h1>
          <p className="text-lg text-green-100">Gerenciador de Progresso Acadêmico</p>
        </div>

        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Criar sua conta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <button 
                onClick={onVoltar}
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                volte para o login
              </button>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {erro && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 