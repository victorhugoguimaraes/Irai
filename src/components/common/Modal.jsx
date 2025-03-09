export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
        
        {children}

        {footer && (
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
} 