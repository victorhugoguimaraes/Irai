export function InputField({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  className = '',
  suffix,
  required = false
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            suffix ? 'pr-8' : ''
          }`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
} 