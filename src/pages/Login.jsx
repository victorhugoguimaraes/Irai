import { useState } from 'react';
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from '../config/firebase';
import { LoginForm } from '../components/auth/LoginForm';
import { TextButton } from '../components/form/TextButton';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState('escolha'); // escolha, login, registro, anonimo
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resultado = await signInWithEmailAndPassword(auth, email, senha);
      onLogin({
        email: resultado.user.email,
        uid: resultado.user.uid,
        nome: resultado.user.displayName
      });
    } catch (error) {
      console.error(error);
      setErro('Email ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    setErro('');
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
      setErro('Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErro('');
    setCarregando(true);

    try {
      const resultado = await signInWithPopup(auth, googleProvider);
      onLogin({
        email: resultado.user.email,
        uid: resultado.user.uid,
        nome: resultado.user.displayName
      });
    } catch (error) {
      console.error(error);
      setErro('Erro ao fazer login com Google');
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

  return (
    <div className="fixed inset-0 bg-green-900 flex items-center justify-center no-scrollbar">
      <div className="flex flex-col items-center justify-center h-screen w-full no-scrollbar">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <img
            className="mx-auto h-16 w-auto animate-float"
            src="/logo.svg"
            alt="Iraí"
          />
          <h1 className="mt-6 text-3xl font-bold text-white drop-shadow-lg">
            Iraí
          </h1>
          <p className="mt-3 text-lg font-medium text-white/90 drop-shadow">
            Gerencie seu progresso acadêmico
          </p>
        </div>

        {modo === 'escolha' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-8">
            {/* Card de Login */}
            <button
              onClick={() => setModo('login')}
              className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white hover:border-green-100 hover:shadow-green-500/10 transition-all group hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">Entrar</h2>
              <p className="text-base text-gray-600 text-center">Acesse sua conta para continuar seu progresso</p>
            </button>

            {/* Card de Registro */}
            <button
              onClick={() => setModo('registro')}
              className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white hover:border-green-100 hover:shadow-green-500/10 transition-all group hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">Criar Conta</h2>
              <p className="text-base text-gray-600 text-center">Registre-se para começar a acompanhar seu progresso</p>
            </button>

            {/* Card Anônimo */}
            <button
              onClick={() => setModo('anonimo')}
              className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20 hover:bg-white hover:border-green-100 hover:shadow-green-500/10 transition-all group hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">Modo Anônimo</h2>
              <p className="text-base text-gray-600 text-center">Use localmente sem criar uma conta</p>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 p-8">
              {modo === 'login' && (
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  senha={senha}
                  setSenha={setSenha}
                  onSubmit={handleLogin}
                  erro={erro}
                  carregando={carregando}
                  onGoogleLogin={handleGoogleLogin}
                />
              )}

              {modo === 'registro' && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Criar uma conta</h2>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    disabled={carregando}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">Registrar com Google</span>
                  </button>

                  <div className="mt-6 mb-6 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-4 py-2 bg-white text-gray-500 inline-block">ou</span>
                    </div>
                  </div>

                  <form onSubmit={handleRegistro} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          id="senha"
                          type={senhaVisivel ? "text" : "password"}
                          required
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setSenhaVisivel(!senhaVisivel)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          {senhaVisivel ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Senha
                      </label>
                      <div className="relative">
                        <input
                          id="confirmarSenha"
                          type={senhaVisivel ? "text" : "password"}
                          required
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setSenhaVisivel(!senhaVisivel)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          {senhaVisivel ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {erro && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                        {erro}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={carregando}
                      className="w-full py-2 px-4 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {carregando ? 'Criando conta...' : 'Criar conta'}
                    </button>
                  </form>
                </>
              )}

              {modo === 'anonimo' && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Modo Anônimo</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Seus dados serão salvos apenas no seu navegador
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Como funciona?</h3>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Seus dados são salvos localmente no seu navegador
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Você pode usar todas as funcionalidades sem criar conta
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={handleAnonimo}
                      className="w-full py-2 px-4 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Continuar sem conta
                    </button>
                  </div>
                </>
              )}

              <div className="mt-6 text-center">
                <TextButton onClick={() => setModo('escolha')} variant="red">
                  Voltar
                </TextButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 