import { useState } from 'react';
import { PasswordInput } from '../form/PasswordInput';
import { TextButton } from '../form/TextButton';

export function LoginForm({ email, setEmail, senha, setSenha, onSubmit, erro, carregando, onGoogleLogin }) {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    if (googleLoading) return;

    try {
      setGoogleLoading(true);
      await onGoogleLogin();
    } catch (error) {
      console.error('Erro no login com Google:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Entrar na sua conta</h2>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={carregando || googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        <span className="text-base font-medium">
          {googleLoading ? 'Conectando...' : 'Continuar com Google'}
        </span>
      </button>

      <div className="mt-8 mb-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={carregando}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        <PasswordInput
          id="senha"
          label="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={carregando}
          required
        />

        {erro && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full py-3 px-4 bg-green-600 text-white text-base font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {carregando ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Entrando...</span>
            </div>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <TextButton variant="red">
          Esqueceu sua senha?
        </TextButton>
      </div>
    </>
  );
} 