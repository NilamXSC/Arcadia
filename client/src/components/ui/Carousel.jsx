import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Carousel({ items, renderItem, autoplayMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const total = items?.length || 0;

  useEffect(() => {
    if (autoplayMs <= 0 || total <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), autoplayMs);
    return () => clearInterval(t);
  }, [autoplayMs, total]);

  if (!total) return null;

  const go = (i) => setIndex((i + total) % total);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-4"
        >
          {renderItem(items[index], index)}
        </motion.div>
      </AnimatePresence>
      {total > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${index === i ? 'bg-cyan-500' : 'bg-slate-600'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
