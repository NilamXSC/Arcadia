import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Accordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl glass overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.title}
            <motion.span animate={{ rotate: open === i ? 180 : 0 }}>▼</motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-3 text-slate-400 text-sm"
              >
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
