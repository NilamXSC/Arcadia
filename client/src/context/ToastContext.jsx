import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    if (duration > 0) setTimeout(() => remove(id), duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, type) => add({ message, type }),
    [add]
  );

  return (
    <ToastContext.Provider value={{ toast, add }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`rounded-lg px-4 py-2 shadow-lg ${
                t.type === 'success' ? 'bg-emerald-600' :
                t.type === 'error' ? 'bg-red-600' :
                t.type === 'warning' ? 'bg-amber-600' : 'bg-slate-600'
              }`}
            >
              {t.message}
              <button className="ml-2 opacity-80 hover:opacity-100" onClick={() => remove(t.id)}>×</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}
