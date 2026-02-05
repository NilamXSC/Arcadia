import { motion, AnimatePresence } from 'framer-motion';

export function Snackbar({ open, message, actionLabel, onAction, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl glass px-4 py-3 shadow-xl"
        >
          <span className="text-sm text-slate-200">{message}</span>
          {actionLabel && (
            <button
              className="text-sm font-semibold text-cyan-400 hover:underline"
              onClick={() => { onAction?.(); onClose?.(); }}
            >
              {actionLabel}
            </button>
          )}
          <button className="text-slate-400 hover:text-white" onClick={onClose}>×</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
