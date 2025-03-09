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
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center">
            <img
              className="mx-auto h-12 w-auto"
              src="/logo.svg"
              alt="Iraí"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Crie sua conta
            </h2>
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

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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