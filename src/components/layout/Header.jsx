import { useAuth } from '../../hooks/useAuth';
import { useUserData } from '../../hooks/useUserData';

export function Header({ onLogout }) {
  const { user } = useAuth();
  const [userData] = useUserData(user?.uid);

  const displayName = userData?.nomeUsuario || user?.displayName || user?.email;

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Iraí" className="h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Iraí
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600 font-medium">
              {displayName}
            </div>
            
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 