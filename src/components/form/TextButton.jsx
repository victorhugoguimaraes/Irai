export function TextButton({ children, onClick, variant = 'red' }) {
  const colors = {
    red: 'text-red-600 hover:text-red-500 hover:bg-red-50 bg-transparent',
    green: 'text-green-600 hover:text-green-500 hover:bg-green-50 bg-transparent'
  };
  

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-base font-medium rounded-lg transition-all ${colors[variant]}`}
    >
      {children}
    </button>
  );
} 