import { PasswordInput } from '../form/PasswordInput';
import { TextButton } from '../form/TextButton';

export function LoginForm({ email, setEmail, senha, setSenha, onSubmit, erro, carregando, onGoogleLogin }) {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Entrar na sua conta</h2>
      </div>

      <button
        onClick={onGoogleLogin}
        disabled={carregando}
        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
      >
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="w-5 h-5"
        />
        <span className="text-base font-medium">Continuar com Google</span>
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
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <PasswordInput
          id="senha"
          label="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
          className="w-full py-3 px-4 bg-green-600 text-white text-base font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
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