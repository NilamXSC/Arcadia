import { motion } from 'framer-motion';

export function BentoGrid({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function BentoCard({ title, children, className = '', span = 1 }) {
  return (
    <motion.div
      layout
      className={`rounded-2xl clay p-4 md:p-5 ${className}`}
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
    >
      {title && <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>}
      {children}
    </motion.div>
  );
}
